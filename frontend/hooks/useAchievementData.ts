import { useCallback, useEffect, useState } from 'react';
import { getBannerImage } from 'shared';
import {
  AchievementData,
  AchievementGroupData,
  SteamGameInfo,
} from '../components/types';
import { getAchievements, getGroups, getScrapedDetails, getSteamGameInfo } from '../GetData';

export interface AchievementDataHook {
  reload(): void;
  silentReload(): void;
  achievements: AchievementData[];
  errors: Error[];
  gameInfo: SteamGameInfo;
  groups: AchievementGroupData[];
  loading: boolean;
}

export function useAchievementData(appId: string): AchievementDataHook {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [groups, setGroups] = useState<AchievementGroupData[]>([]);
  const [gameInfo, setGameInfo] = useState<SteamGameInfo>({} as SteamGameInfo);
  const [errors, setErrors] = useState<Error[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [silentReloadTrigger, setSilentReloadTrigger] = useState(0);

  const loadData = useCallback(async (silent: boolean) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      // prettier-ignore
      const [
        achievementsData,
        groupsData,
        gameInfoData,
        scrapedData,
        steamAchievements,
      ] = await Promise.all([
        getAchievements(appId),
        getGroups(appId),
        getSteamGameInfo(appId),
        getScrapedDetails(appId).catch((error: unknown) => {
          console.error('Failed to load scraped details:', error);

          return null;
        }),
        SteamClient.Apps.GetMyAchievementsForApp(appId).then(res => res.data.rgAchievements),
      ]);

      // Validate data
      if (!groupsData) throw new Error('Failed to load groups');
      if (!achievementsData) throw new Error('Failed to load achievements');
      if (!gameInfoData) throw new Error('Failed to load game info');

      const steamAchievementMap = new Map(steamAchievements.map(sa => [sa.strID, sa]));
      const scrapedAchievementMap = scrapedData?.achievements ?? {};

      // Update achievements with Steam and Scraped data
      const updatedAchievements = achievementsData.map((achievement) => {
        const steamAchievement = steamAchievementMap.get(achievement.apiName);
        const scrapedAchievement = scrapedAchievementMap[achievement.apiName] ?? null;

        return {
          ...achievement,
          strImage: steamAchievement?.strImage ?? '',
          unlocked: steamAchievement?.bAchieved ?? false,
          name: steamAchievement?.strName ?? achievement.name,
          description: steamAchievement?.strDescription.trim() ?? achievement.description.trim(),
          unlockedDate: steamAchievement?.rtUnlocked !== 0 ? new Date((steamAchievement?.rtUnlocked ?? 0) * 1000) : undefined,
          guideUrl: scrapedAchievement?.guideUrl,
          tags: scrapedAchievement?.tags,
          completedCount: scrapedAchievement?.completedCount,
          totalPlayers: scrapedAchievement?.totalPlayers,
          isHidden: steamAchievement?.bHidden ?? false,
        } as AchievementData;
      });

      // Create base game group
      const allGroupAchievements = new Set(groupsData.flatMap(group => group.achievementApiNames));

      const baseGameAchievements = achievementsData
        .filter(achievement => !allGroupAchievements.has(achievement.apiName))
        .map(achievement => achievement.apiName);

      const baseGameReleaseDate = scrapedData?.updates ? scrapedData.updates[0]?.displayReleaseDate : undefined;

      const baseGameGroup: AchievementGroupData = {
        name: undefined,
        achievementApiNames: baseGameAchievements,
        releaseDate: baseGameReleaseDate !== undefined ? new Date(baseGameReleaseDate) : undefined,
        bannerUrl: await getBannerImage(Number(appId)),
      };

      const updatedGroupsData = groupsData.map((group, index) => {
        const releaseDate = scrapedData?.updates ? scrapedData.updates[index + 1]?.displayReleaseDate : undefined;

        return {
          ...group,
          releaseDate: releaseDate !== undefined ? new Date(releaseDate) : undefined,
        };
      });

      setErrors([]);
      setAchievements(updatedAchievements);
      setGroups([baseGameGroup, ...updatedGroupsData]);
      setGameInfo(gameInfoData);
    } catch (error) {
      console.error('Error loading achievement data:', error);
      setErrors(prev => [...prev, error as Error]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [appId]);

  useEffect(() => {
    loadData(false);
  }, [loadData, reloadTrigger]);

  useEffect(() => {
    loadData(true);
  }, [loadData, silentReloadTrigger]);

  const reload = useCallback(() => {
    setReloadTrigger(prev => prev + 1);
  }, []);

  const silentReload = useCallback(() => {
    setSilentReloadTrigger(prev => prev + 1);
  }, []);

  return { achievements, groups, gameInfo, errors, loading, reload, silentReload };
}
