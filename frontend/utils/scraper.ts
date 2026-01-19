import { ScrapedAchievement, ScrapedUpdate } from '../components/types';

export interface BackendScrapedResponse {
  error?: string;
  modelText?: string;
  success: boolean;
}

interface SHModelTag {
  name: string;
  tagId: number;
}

interface SHModelTagVote {
  tagId: number;
}

interface SHModelAchievementItem {
  apiName: string;
  guidesUrl?: string;
  playersQualifiedCount?: number;
  publishedGuideCount?: number;
  tagVotes?: SHModelTagVote[];
  validUnlockCount?: number;
}

interface SHModelUpdate {
  displayReleaseDate: number;
  dlcAppIds: number[];
  firstUnlockDate: number;
  inserted: number;
  updateId: number;
  updateNumber: number;
}

interface SHModel {
  listData?: {
    pagedList?: {
      items?: SHModelAchievementItem[];
    };
  };
  tags?: SHModelTag[];
  updates?: SHModelUpdate[];
}

function parseModelText(modelText: string): SHModel {
  // 1. Extract and hide strings
  const strings: Record<string, string> = {};
  let stringCount = 0;
  const placeholderPrefix = '\u0001';
  const placeholderSuffix = '\u0002';

  let jsonText = modelText.replace(/(['"])(.*?)\1/gs, (_match, _quote, content: string) => {
    stringCount++;
    const placeholder = `${placeholderPrefix}${stringCount}${placeholderSuffix}`;
    // Escape internal double quotes for JSON
    strings[placeholder] = `"${content.replace(/"/g, '\\"')}"`;

    return placeholder;
  });

  // 2. Quote unquoted keys (valid JS identifiers followed by colon)
  jsonText = jsonText.replace(/([{,\s])([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  // Handle the very first key if it's right after the brace without space
  jsonText = jsonText.replace(/^{([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '{"$1":');

  // 3. Replace JS values
  jsonText = jsonText.replace(/new Date\((\d+)\)/g, '$1');
  jsonText = jsonText.replace(/:\s*undefined/g, ': null');

  // 4. Restore strings
  // eslint-disable-next-line no-control-regex
  jsonText = jsonText.replace(/\u0001(\d+)\u0002/g, (_match, id: string) => {
    return strings[`${placeholderPrefix}${id}${placeholderSuffix}`] ?? '';
  });

  // 5. Remove trailing commas before ] or }
  for (let i = 0; i < 5; i++) {
    jsonText = jsonText.replace(/,\s*([\]}])/g, '$1');
  }

  try {
    return JSON.parse(jsonText) as SHModel;
  } catch (error) {
    console.error('Failed to parse converted JSON:', error);
    console.error('JSON Snippet:', jsonText.substring(0, 1000));
    throw error;
  }
}

export function processScrapedModel(modelText: string): { achievements: Record<string, ScrapedAchievement>; updates: ScrapedUpdate[]; } {
  const model = parseModelText(modelText);
  if (model.listData === undefined) {
    return { achievements: {}, updates: [] };
  }
  const achievements: Record<string, ScrapedAchievement> = {};
  if (model.listData.pagedList?.items !== undefined) {
    model.listData.pagedList.items.forEach((item: SHModelAchievementItem) => {
      const tags: Record<string, number> = {};
      if (item.tagVotes !== undefined) {
        item.tagVotes.forEach((vote: SHModelTagVote) => {
          const name = getAchievementTagDescription(vote.tagId);
          tags[name] ??= 0;
          tags[name]++;
        });
      }

      achievements[item.apiName] = {
        apiName: item.apiName,
        tags,
        guideUrl: (item.guidesUrl !== undefined && item.guidesUrl !== '' && (item.publishedGuideCount ?? 0) > 0)
          ? `https://steamhunters.com${item.guidesUrl}`
          : undefined,
        completedCount: item.validUnlockCount,
        totalPlayers: item.playersQualifiedCount,
      };
    });
  }

  const updates: ScrapedUpdate[] = model.updates?.map(update => ({
    updateId: update.updateId,
    updateNumber: update.updateNumber,
    displayReleaseDate: update.displayReleaseDate,
  })) ?? [];

  return { achievements, updates };
}

// Hardcoded tags from SteamHunters.com
function getAchievementTagDescription(n: AchievementTag): string {
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (n) {
    case AchievementTag.MainStoryline:
      return 'Main Storyline';
    case AchievementTag.DifficultySpecific:
      return 'Difficulty Specific';
    case AchievementTag.DifficultyStackable:
      return 'Difficulty Stackable';
    case AchievementTag.TimeOrDateSpecific:
      return 'Time or Date Specific';
    case AchievementTag.PlayWithDeveloper:
      return 'Play with Developer';
    case AchievementTag.CompletionAchievement:
      return 'Completion Achievement';
    case AchievementTag.ChoiceDependent:
      return 'Choice Dependent';
    case AchievementTag.ThirdPartyServer:
      return 'Third Party Server';
    case AchievementTag.SteamworksGameServer:
      return 'Steamworks Game Server';
    case AchievementTag.StartupAchievement:
      return 'Startup Achievement';
    case AchievementTag.InAppPurchase:
      return 'In-App Purchase';
    case AchievementTag.LuckBased:
      return 'Luck-Based';
    default:
      return AchievementTag[n];
  }
}

// Hardcoded tags from SteamHunters.com
enum AchievementTag {
  Missable = 1,
  Multiplayer = 2,
  MainStoryline = 3,
  DifficultySpecific = 4,
  DifficultyStackable = 5,
  TimeOrDateSpecific = 6,
  PlayWithDeveloper = 7,
  CompletionAchievement = 8,
  Collectible = 9,
  Online = 10,
  Speedrun = 11,
  Viral = 12,
  ChoiceDependent = 13,
  Grind = 14,
  ThirdPartyServer = 15,
  P2P = 16,
  SteamworksGameServer = 17,
  StartupAchievement = 18,
  InAppPurchase = 19,
  LuckBased = 20,
  Idle = 21,
  NoHit = 22,
  Stackable = 23,
  SessionHost = 24,
  RequiresFileModification = 25,
}
