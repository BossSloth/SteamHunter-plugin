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
