export type ApiName = string;

// https://steamhunters.com/api/Help/Api/GET-apps-appId-achievements
export interface AchievementData {
  achievementId: number;
  apiName: string;
  description: string;
  localPercentage: number;
  name: string;
  obtainability: Obtainability;
  points: number;
  steamPercentage: number;
  steamPoints: number;

  // Extra properties from steam
  strImage: string;
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

// https://steamhunters.com/api/Help/Api/GET-GetAchievementGroups-v1_appId_groupBy[0]_groupBy[1]_includeMultiplayerGroup
export interface AchievementGroupData {
  achievementApiNames: ApiName[];
  dlcAppId?: number;
  dlcAppName?: string;
  name?: string;
}

/**
 * @example
 * {
 *     "strID": "ACH_ALPS",
 *     "strName": "Je Suis Perdu!",
 *     "strDescription": "You've had one heck of a ski holiday.",
 *     "bAchieved": true,
 *     "rtUnlocked": 1735426639,
 *     "strImage": "https://cdn.steamstatic.com/steamcommunity/public/images/apps/427410/e91840161b6907cd389c801e7b83aa2841000f6b.jpg",
 *     "bHidden": true,
 *     "flMinProgress": 0,
 *     "flCurrentProgress": 0,
 *     "flMaxProgress": 0,
 *     "flAchieved": 11.300000190734863
 * }
 */
export interface SteamAchievementData {
  bAchieved: boolean;
  bHidden: boolean;
  flAchieved: number;
  flCurrentProgress: number;
  flMaxProgress: number;
  flMinProgress: number;
  rtUnlocked: number;
  strDescription: string;
  strID: string;
  strImage: string; // Image URL
  strName: string;
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
  Unlocked = 'Unlocked',
  Default = 'Default',
}

export enum GroupBy {
  DLCAndUpdate = 'DLC & update',
  Nothing = 'Nothing',
  Unlocked = 'Unlocked',
  DLC = 'DLC',
}

export interface AchievementSettings {
  expandAll: boolean;
  groupBy: GroupBy;
  reverse: boolean;
  searchQuery?: string;
  showPoints: boolean;
  showUnlocked: boolean;
  sortBy: SortBy;
}

export interface RequestAchievementGroupsResponse {
  groups: AchievementGroupData[];
}
