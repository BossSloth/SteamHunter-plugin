import { Spinner } from '@steambrew/client';
import React, { createRef, JSX, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { AchievementDataHook, useAchievementData } from '../hooks/useAchievementData';
import { useAchievementStore } from '../stores';
import { AchievementGroup } from './AchievementGroup';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorDisplay } from './ErrorDisplay';
import { Header } from './Header';
import { PreferencesPopup } from './PreferencesPopup';
import { Styles } from './Styles';
import { AchievementData, AchievementGroupData, GroupBy, SortBy, ViewSettings } from './types';

interface AchievementPageProps {
  readonly appId: string;
}

function filterAndSortAchievements(achievements: AchievementData[], settings: ViewSettings): AchievementData[] {
  const { sortBy, reverse, showUnlocked, searchQuery } = settings;

  return achievements
    .filter((achievement) => {
      // Filter by search query
      if (searchQuery !== undefined) {
        const query = searchQuery.toLowerCase();

        return achievement.name.toLowerCase().includes(query)
          || achievement.description.toLowerCase().includes(query)
          || (achievement.tags !== undefined && Object.keys(achievement.tags).some(tag => tag.toLowerCase().includes(query)));
      }

      return true;
    })
    .filter(achievement => showUnlocked || !achievement.unlocked)
    .sort((a, b) => {
      switch (sortBy) {
        case SortBy.Default:
          return 0;
        case SortBy.SteamHunters:
          return reverse ? a.localPercentage - b.localPercentage : b.localPercentage - a.localPercentage;
        case SortBy.Steam:
          return reverse ? a.steamPercentage - b.steamPercentage : b.steamPercentage - a.steamPercentage;
        case SortBy.Name:
          return reverse ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
        case SortBy.Date:
          return reverse ? (a.unlockedDate?.getTime() ?? Infinity) - (b.unlockedDate?.getTime() ?? Infinity) : (b.unlockedDate?.getTime() ?? 0) - (a.unlockedDate?.getTime() ?? 0);
        default:
          return 0;
      }
    });
}

function getGroupedAchievements(
  achievements: AchievementData[],
  groups: AchievementGroupData[],
  groupBy: GroupBy,
): AchievementGroupData[] {
  // if (!groups || !achievements) return [];

  const baseBannerUrl = groups[0]?.bannerUrl;
  const baseReleaseDate = groups[0]?.releaseDate;

  switch (groupBy) {
    case GroupBy.DLCAndUpdate:
      return groups;
    case GroupBy.Nothing:
      return [
        {
          name: undefined,
          achievementApiNames: achievements.map(a => a.apiName),
          bannerUrl: baseBannerUrl,
          releaseDate: baseReleaseDate,
        },
      ];
    case GroupBy.Unlocked:
      return [
        {
          name: 'Achieved',
          achievementApiNames: achievements.filter(a => a.unlocked).map(a => a.apiName),
          bannerUrl: baseBannerUrl,
          releaseDate: baseReleaseDate,
        },
        {
          name: 'Unachieved',
          achievementApiNames: achievements.filter(a => !a.unlocked).map(a => a.apiName),
          bannerUrl: baseBannerUrl,
          releaseDate: baseReleaseDate,
        },
      ];
    case GroupBy.DLC: {
      const baseAchievements = groups.filter(g => g.dlcAppId === undefined);
      const dlcAchievements = groups.filter(g => g.dlcAppId !== undefined);

      return [
        {
          name: baseAchievements[0]?.name,
          achievementApiNames: baseAchievements.flatMap(a => a.achievementApiNames),
          bannerUrl: baseBannerUrl,
          releaseDate: baseReleaseDate,
        },
        ...dlcAchievements,
      ];
    }
    default:
      return [];
  }
}

export interface ProcessedGroup {
  group: AchievementGroupData;
  groupAchievements: AchievementData[];
  totalPoints: number;
}

interface AchievementContentProps {
  onCacheCleared(): void;
  readonly appId: string;
  readonly data: AchievementDataHook;
}

function useAchievementGrouping(data: AchievementDataHook, viewSettings: ViewSettings): {
  processedGroups: ProcessedGroup[];
  groupedAchievementsLength: number;
} {
  const { groupBy } = viewSettings;

  const achievementMap = useMemo(() => {
    return new Map(data.achievements.map(a => [a.apiName, a]));
  }, [data.achievements]);

  const groupedAchievements = useMemo(
    () => getGroupedAchievements(data.achievements, data.groups, groupBy),
    [data.achievements, data.groups, groupBy],
  );

  const getAchievementsForGroup = useCallback((apiNames: string[]): AchievementData[] => {
    const result: AchievementData[] = [];
    for (const apiName of apiNames) {
      const achievement = achievementMap.get(apiName);
      if (achievement) {
        result.push(achievement);
      }
    }

    return result;
  }, [achievementMap]);

  const processedGroups = useMemo(() => {
    return groupedAchievements.map((group) => {
      const groupAchievements = filterAndSortAchievements(
        getAchievementsForGroup(group.achievementApiNames),
        viewSettings,
      );
      const totalPoints = groupAchievements.reduce((sum, a) => sum + a.points, 0);

      return { group, groupAchievements, totalPoints };
    });
  }, [groupedAchievements, getAchievementsForGroup, viewSettings]);

  return { processedGroups, groupedAchievementsLength: groupedAchievements.length };
}

const AchievementContent = React.memo(({
  onCacheCleared,
  data,
  appId,
}: AchievementContentProps): JSX.Element => {
  const settings = useAchievementStore();
  const [showPreferences, setShowPreferences] = useState(false);
  const { processedGroups, groupedAchievementsLength } = useAchievementGrouping(data, settings);

  // Initialize expandedGroups (default to all expanded)
  const [expandedGroups, setExpandedGroups] = React.useState<Set<number>>(() => {
    return new Set(Array.from({ length: groupedAchievementsLength }, (_, i) => i));
  });

  const allGroupsExpanded = useMemo(() => {
    return expandedGroups.size === groupedAchievementsLength;
  }, [expandedGroups, groupedAchievementsLength]);

  const handleGroupExpand = useCallback((index: number, isExpanded: boolean): void => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }

      return newSet;
    });
  }, []);

  const handleExpandAllClick = useCallback((): void => {
    if (allGroupsExpanded) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(Array.from({ length: groupedAchievementsLength }, (_, i) => i)));
    }
  }, [allGroupsExpanded, groupedAchievementsLength]);

  return (
    <>
      <Header
        achievementCount={data.achievements.length}
        onExpandAllClick={handleExpandAllClick}
        allGroupsExpanded={allGroupsExpanded}
        onCacheCleared={onCacheCleared}
        onPreferencesClick={() => { setShowPreferences(true); }}
        appId={appId}
      />

      {showPreferences && (
        <PreferencesPopup
          onClose={() => { setShowPreferences(false); }}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          processedGroup={processedGroups[0]!}
        />
      )}

      <div className="achievement-groups">
        {processedGroups.map(({ group, groupAchievements, totalPoints }, index) => (
          <AchievementGroup
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            groupInfo={group}
            title={group.name}
            achievements={groupAchievements}
            totalPoints={totalPoints}
            isExpanded={expandedGroups.has(index)}
            gameInfo={data.gameInfo}
            onExpandChange={(isExpanded) => { handleGroupExpand(index, isExpanded); }}
          />
        ))}
      </div>
    </>
  );
});

export function AchievementPage({ appId }: AchievementPageProps): JSX.Element {
  return (
    <ErrorBoundary>
      <AchievementPageContent appId={appId} />
    </ErrorBoundary>
  );
}

function AchievementPageContent({ appId }: AchievementPageProps): JSX.Element {
  const data = useAchievementData(appId);
  const resetToDefault = useAchievementStore(s => s.resetToDefault);
  const domElement = createRef<HTMLDivElement>();

  useLayoutEffect(() => {
    resetToDefault();
  }, [appId, resetToDefault]);

  function handleCacheCleared(): void {
    data.reload();
  }

  useEffect(() => {
    const achievementSubscriber = SteamClient.GameSessions.RegisterForAchievementNotification(() => {
      data.silentReload();
    });

    return (): void => {
      achievementSubscriber.unregister();
    };
  }, []);

  if (data.errors.length > 0) {
    return <ErrorDisplay errors={data.errors} />;
  }

  return (
    <div className="steam-hunters-achievements-page" ref={domElement}>
      {data.loading
        ? (
            <Spinner className="steam-hunters-spinner" />
          )
        : (
            <>
              <Styles />
              <AchievementContent
                data={data}
                onCacheCleared={handleCacheCleared}
                appId={appId}
              />
            </>
          )}
    </div>
  );
}
