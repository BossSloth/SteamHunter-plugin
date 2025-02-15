import { useState, useEffect, useCallback } from 'react';
import { AchievementData, AchievementGroupData, SteamGameInfo, SteamAchievementData, AchievementUpdateData } from '../components/types';
import { getAchievements, getGroups, getSteamGameInfo, getAchievementUpdates } from '../GetData';

export interface AchievementDataHook {
  achievements: AchievementData[];
  groups: AchievementGroupData[];
  gameInfo: SteamGameInfo;
  achievementUpdates: AchievementUpdateData[];
  errors: Error[];
  loading: boolean;
  reload: () => void;
}

export const useAchievementData = (appId: string): AchievementDataHook => {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [groups, setGroups] = useState<AchievementGroupData[]>([]);
  const [gameInfo, setGameInfo] = useState<SteamGameInfo>();
  const [errors, setErrors] = useState<Error[]>([]);
  const [loading, setLoading] = useState(true);
  const [achievementUpdates, setAchievementUpdates] = useState<AchievementUpdateData[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const [
         groupsData,
         achievementsData, 
         gameInfoData, 
         achievementUpdates, 
         steamAchievements
        ] = await Promise.all([
          getGroups(appId),
          getAchievements(appId),
          getSteamGameInfo(appId),
          getAchievementUpdates(appId),
          SteamClient.Apps.GetMyAchievementsForApp(appId).then((res: any) => res?.data?.rgAchievements) as Promise<SteamAchievementData[]>,
      ]);

      // Validate data
      if (!groupsData) throw new Error('Failed to load groups');
      if (!achievementsData) throw new Error('Failed to load achievements');
      if (!gameInfoData) throw new Error('Failed to load game info');
      if (!achievementUpdates) throw new Error('Failed to load achievement updates');
      if (!steamAchievements) throw new Error('Failed to load Steam achievements');

      // Update achievements with Steam data
      const updatedAchievements = achievementsData.map(achievement => {
        const steamAchievement = steamAchievements.find(sa => sa.strID === achievement.apiName);
        return {
          ...achievement,
          strImage: steamAchievement?.strImage || '',
          unlocked: steamAchievement?.bAchieved || false,
          name: steamAchievement?.strName || achievement.name,
          description: steamAchievement?.strDescription || achievement.description,
        };
      });

      // Create base game group
      const allGroupAchievements = new Set(
        groupsData.flatMap(group => group.achievementApiNames)
      );
      
      const baseGameAchievements = achievementsData
        .filter(achievement => !allGroupAchievements.has(achievement.apiName))
        .map(achievement => achievement.apiName);

      const baseGameGroup: AchievementGroupData = {
        name: null,
        achievementApiNames: baseGameAchievements,
      };

      setErrors([]);
      setAchievements(updatedAchievements);
      setGroups([baseGameGroup, ...groupsData]);
      setGameInfo(gameInfoData);
      setAchievementUpdates(achievementUpdates);
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
};
