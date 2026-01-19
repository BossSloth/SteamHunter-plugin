import { Spinner } from '@steambrew/client';
import React, { createRef, JSX, useEffect, useState } from 'react';
import { AchievementDataHook, useAchievementData } from '../hooks/useAchievementData';
import { getDefaultSettings } from '../utils/cache';
import { AchievementGroup } from './AchievementGroup';
import { ErrorDisplay } from './ErrorDisplay';
import { Header } from './Header';
import { Styles } from './Styles';
import { AchievementData, AchievementGroupData, AchievementSettings, GroupBy, SortBy } from './types';

interface AchievementPageProps {
  readonly appId: string;
}

const defaultSettings: AchievementSettings = {
  groupBy: GroupBy.DLCAndUpdate,
  sortBy: SortBy.SteamHunters,
  reverse: false,
  expandAll: true,
  showUnlocked: true,
  showPoints: true,
  searchQuery: '',
};

function filterAndSortAchievements(achievements: AchievementData[], settings: AchievementSettings): AchievementData[] {
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
        case SortBy.Unlocked:
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

  switch (groupBy) {
    case GroupBy.DLCAndUpdate:
      return groups;
    case GroupBy.Nothing:
      return [
        {
          name: undefined,
          achievementApiNames: achievements.map(a => a.apiName),
        },
      ];
    case GroupBy.Unlocked:
      return [
        {
          name: 'Achieved',
          achievementApiNames: achievements.filter(a => a.unlocked).map(a => a.apiName),
        },
        {
          name: 'Unachieved',
          achievementApiNames: achievements.filter(a => !a.unlocked).map(a => a.apiName),
        },
      ];
    case GroupBy.DLC: {
      const baseAchievements = groups.filter(g => g.dlcAppId === undefined);
      const dlcAchievements = groups.filter(g => g.dlcAppId !== undefined);

      return [
        {
          name: baseAchievements[0]?.name,
          achievementApiNames: baseAchievements.flatMap(a => a.achievementApiNames),
        },
        ...dlcAchievements,
      ];
    }
    default:
      return [];
  }
}

function AchievementContent({
  onSettingsChange,
  onCacheCleared,
  data,
  settings,
  appId,
}: {
  onSettingsChange(settings: Partial<AchievementSettings> | null): void;
  onCacheCleared(): void;
  readonly data: AchievementDataHook;
  readonly settings: AchievementSettings;
  readonly appId: string;
}): JSX.Element {
  const { groupBy, sortBy, expandAll } = settings;
  const groupedAchievements = getGroupedAchievements(data.achievements, data.groups, groupBy);

  // Initialize expandedGroups with all group indices
  const [expandedGroups, setExpandedGroups] = React.useState<Set<number>>(() => new Set(Array.from({ length: groupedAchievements.length }, (_, i) => i)));

  const allGroupsExpanded = React.useMemo(() => {
    return expandedGroups.size === groupedAchievements.length;
  }, [expandedGroups, groupedAchievements.length]);

  React.useEffect(() => {
    if (expandAll !== allGroupsExpanded) {
      onSettingsChange({ expandAll: allGroupsExpanded });
    }
  }, [allGroupsExpanded, expandAll, onSettingsChange]);

  function handleGroupExpand(index: number, isExpanded: boolean): void {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }

      return newSet;
    });
  }

  function handleExpandAllClick(): void {
    if (allGroupsExpanded) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(Array.from({ length: groupedAchievements.length }, (_, i) => i)));
    }
  }

  function getAchievementsForGroup(apiNames: string[]): AchievementData[] {
    return data.achievements.filter(achievement => apiNames.includes(achievement.apiName));
  }

  function calculateTotalPoints(groupAchievements: AchievementData[]): number {
    return groupAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
  }

  return (
    <>
      <Header
        settings={settings}
        onSettingsChange={onSettingsChange}
        achievementCount={data.achievements.length}
        groupCount={groupedAchievements.length}
        onExpandAllClick={handleExpandAllClick}
        onCacheCleared={onCacheCleared}
        appId={appId}
      />

      <div className="achievement-groups">
        {groupedAchievements.map((group, index) => {
          const groupAchievements = filterAndSortAchievements(
            getAchievementsForGroup(group.achievementApiNames),
            settings,
          );
          const totalPoints = calculateTotalPoints(groupAchievements);

          return (
            <AchievementGroup
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              groupInfo={group}
              title={group.name}
              achievements={groupAchievements}
              totalPoints={totalPoints}
              isExpanded={expandedGroups.has(index)}
              sortedBy={sortBy}
              showPoints={settings.showPoints}
              gameInfo={data.gameInfo}
              onExpandChange={(isExpanded) => { handleGroupExpand(index, isExpanded); }}
              showUnlocked={settings.showUnlocked}
            />
          );
        })}
      </div>
    </>
  );
}

// eslint-disable-next-line react/no-multi-comp
export function AchievementPage({ appId }: AchievementPageProps): JSX.Element {
  const data = useAchievementData(appId);
  const [settings, setSettings] = useState<AchievementSettings>(() => {
    const savedSettings = getDefaultSettings();

    return savedSettings ?? defaultSettings;
  });

  const domElement = createRef<HTMLDivElement>();

  function handleSettingsChange(newSettings: Partial<AchievementSettings> | null): void {
    if (newSettings === null) {
      setSettings(defaultSettings);
    } else {
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  }

  function handleCacheCleared(): void {
    data.reload();
  }

  if (data.errors.length > 0) {
    return <ErrorDisplay errors={data.errors} />;
  }

  useEffect(() => {
    const achievementSubscriber = SteamClient.GameSessions.RegisterForAchievementNotification(() => {
      data.silentReload();
    });

    return (): void => {
      achievementSubscriber.unregister();
    };
  }, []);

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
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onCacheCleared={handleCacheCleared}
                appId={appId}
              />
            </>
          )}
    </div>
  );
}
