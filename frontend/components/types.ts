export type ApiName = string;

// https://steamhunters.com/api/Help/Api/GET-apps-appId-achievements
export interface AchievementData {
  achievementId: number;
  apiName: string;
  /**
   * Number of players who have completed this achievement
   */
  completedCount?: number;
  description: string;
  /**
   * URL to the guide for this achievement
   */
  guideUrl?: string;
  isHidden: boolean;
  localPercentage: number;
  name: string;
  obtainability: Obtainability;
  points: number;
  steamPercentage: number;
  steamPoints: number;
  strImage: string;
  /*
   * Key is tag name, value is tag count
   */
  tags?: Record<string, number>;
  /**
   * Total players qualified for this game
   */
  totalPlayers?: number;
  unlocked: boolean;
  unlockedDate?: Date;
}

// https://steamhunters.com/api/Help/ResourceModel?modelName=Obtainability
export enum Obtainability {
  Obtainable,
  BrokenButObtainable,
  ConditionallyObtainable,
  Unobtainable,
}

export const ObtainabilityNames = {
  [Obtainability.Obtainable]: 'Obtainable',
  [Obtainability.BrokenButObtainable]: 'Broken but obtainable',
  [Obtainability.ConditionallyObtainable]: 'Conditionally obtainable',
  [Obtainability.Unobtainable]: 'Unobtainable',
} as const;

// https://steamhunters.com/api/Help/Api/GET-GetAchievementGroups-v1_appId_groupBy[0]_groupBy[1]_includeMultiplayerGroup
export interface AchievementGroupData {
  achievementApiNames: ApiName[];
  /** extra data added from steam */
  bannerUrl?: string;
  dlcAppId?: number;
  dlcAppName?: string;
  name?: string;
  releaseDate?: Date;
}

// https://steamhunters.com/api/Help/Api/GET-apps-appId
export interface SteamGameInfo {
  appId: number;
  name: string;
  playersQualifiedCount: number;
  releaseDate: string;
}

export enum SortBy {
  SteamHunters = 'SH%',
  Steam = 'Steam%',
  Name = 'Name',
  Date = 'Date',
  Default = 'Default',
}

export enum GroupBy {
  DLCAndUpdate = 'DLC & update',
  Nothing = 'Nothing',
  Unlocked = 'Unlocked',
  DLC = 'DLC',
}

export interface GlobalPreferences {
  hideHidden: boolean;
  showGuides: boolean;
  /** Temporary setting until hltb data get's moved */
  showHltb: boolean;
  showObtainability: boolean;
  showPlayerCount: boolean;
  showPoints: boolean;
  showTags: boolean;
}

export interface ViewSettings {
  expandAll: boolean;
  groupBy: GroupBy;
  preferencesOpen: boolean;
  reverse: boolean;
  searchQuery?: string;
  showUnlocked: boolean;
  sortBy: SortBy;
}

export type AchievementSettings = GlobalPreferences & ViewSettings;

export interface RequestAchievementGroupsResponse {
  groups: AchievementGroupData[];
}

export interface ScrapedAchievement {
  apiName: string;
  /*
   * Number of players who have completed this achievement
   */
  completedCount?: number;
  guideUrl?: string;
  /*
   * Key is tag name, value is tag count
   */
  tags: Record<string, number>;
  /*
   * Total players qualified for this game
   */
  totalPlayers?: number;
}

export interface ScrapedUpdate {
  displayReleaseDate: number;
  updateId: number;
  updateNumber: number;
}

export interface ScrapedAchievementsResponse {
  achievements: Record<string, ScrapedAchievement>;
  success: boolean;
  updates: ScrapedUpdate[];
}
