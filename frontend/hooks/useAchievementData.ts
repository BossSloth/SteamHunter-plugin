import { useCallback, useEffect, useState } from 'react';
import {
  AchievementData,
  AchievementGroupData,
  AchievementUpdateData,
  SteamAchievementData,
  SteamGameInfo,
} from '../components/types';
import { getAchievements, getAchievementUpdates, getGroups, getSteamGameInfo } from '../GetData';

export interface AchievementDataHook {
  reload(): void;
  achievements: AchievementData[];
  groups: AchievementGroupData[];
  gameInfo: SteamGameInfo;
  achievementUpdates: AchievementUpdateData[];
  errors: Error[];
  loading: boolean;
}

export function useAchievementData(appId: string): AchievementDataHook {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [groups, setGroups] = useState<AchievementGroupData[]>([]);
  const [gameInfo, setGameInfo] = useState<SteamGameInfo>({} as SteamGameInfo);
  const [errors, setErrors] = useState<Error[]>([]);
  const [loading, setLoading] = useState(true);
  const [achievementUpdates, setAchievementUpdates] = useState<AchievementUpdateData[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const loadData = useCallback(async () => {
    try {
      // prettier-ignore
      const [
        achievementsData,
        groupsData,
        gameInfoData,
        achievementUpdatesData,
        steamAchievements,
      ] = await Promise.all([
        getAchievements(appId),
        getGroups(appId),
        getSteamGameInfo(appId),
        getAchievementUpdates(appId),
        // TODO: use steam-types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        (SteamClient.Apps.GetMyAchievementsForApp(appId) as Promise<any>).then((res: any) => res?.data?.rgAchievements) as Promise<SteamAchievementData[] | undefined>,
      ]);

      // Validate data
      if (!groupsData) throw new Error('Failed to load groups');
      if (!achievementsData) throw new Error('Failed to load achievements');
      if (!gameInfoData) throw new Error('Failed to load game info');
      if (!achievementUpdatesData) throw new Error('Failed to load achievement updates');
      if (!steamAchievements) throw new Error('Failed to load Steam achievements');

      // Update achievements with Steam data
      const updatedAchievements = achievementsData.map((achievement): AchievementData => {
        const steamAchievement = steamAchievements.find(sa => sa.strID === achievement.apiName);

        return {
          ...achievement,
          strImage: steamAchievement?.strImage ?? '',
          unlocked: steamAchievement?.bAchieved ?? false,
          name: steamAchievement?.strName ?? achievement.name,
          description: steamAchievement?.strDescription ?? achievement.description,
          unlockedDate: steamAchievement?.rtUnlocked !== 0 ? new Date((steamAchievement?.rtUnlocked ?? 0) * 1000) : undefined,
        };
      });

      // Create base game group
      const allGroupAchievements = new Set(groupsData.flatMap(group => group.achievementApiNames));

      const baseGameAchievements = achievementsData
        .filter(achievement => !allGroupAchievements.has(achievement.apiName))
        .map(achievement => achievement.apiName);

      const baseGameGroup: AchievementGroupData = {
        name: undefined,
        achievementApiNames: baseGameAchievements,
      };

      setErrors([]);
      setAchievements(updatedAchievements);
      setGroups([baseGameGroup, ...groupsData]);
      setGameInfo(gameInfoData);
      setAchievementUpdates(achievementUpdatesData);
    } catch (error) {
      console.error('Error loading achievement data:', error);
      setErrors(prev => [...prev, error as Error]);
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData, reloadTrigger]);

  const reload = useCallback(() => {
    setReloadTrigger(prev => prev + 1);
  }, []);

  return { achievements, groups, gameInfo, errors, loading, achievementUpdates, reload };
}
