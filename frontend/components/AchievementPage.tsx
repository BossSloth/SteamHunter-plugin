import { Spinner } from '@steambrew/client';
import React, { createRef, useEffect, useState } from 'react';
import { CreateCssElement } from '../cdn';
import { AchievementDataHook, useAchievementData } from '../hooks/useAchievementData';
import { getDefaultSettings } from '../utils/cache';
import { AchievementGroup } from './AchievementGroup';
import { ErrorDisplay } from './ErrorDisplay';
import { Header } from './Header';
import { AchievementData, AchievementGroupData, AchievementSettings, GroupBy, SortBy } from './types';

interface AchievementPageProps {
  appId: string;
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

const filterAndSortAchievements = (achievements: AchievementData[], settings: AchievementSettings) => {
  const { sortBy, reverse, showUnlocked, searchQuery } = settings;

  return achievements
    .filter((achievement) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return achievement.name.toLowerCase().includes(query) || achievement.description.toLowerCase().includes(query);
      }
      return true;
    })
    .filter((achievement) => showUnlocked || !achievement.unlocked)
    .sort((a, b) => {
      switch (sortBy) {
        case SortBy.SteamHunters:
          return reverse ? a.localPercentage - b.localPercentage : b.localPercentage - a.localPercentage;
        case SortBy.Steam:
          return reverse ? a.steamPercentage - b.steamPercentage : b.steamPercentage - a.steamPercentage;
        case SortBy.Name:
          return reverse ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
};

const getGroupedAchievements = (
  achievements: AchievementData[],
  groups: AchievementGroupData[],
  groupBy: GroupBy,
): AchievementGroupData[] => {
  if (!groups || !achievements) return [];

  switch (groupBy) {
    case GroupBy.DLCAndUpdate:
      return groups;
    case GroupBy.Nothing:
      return [
        {
          name: undefined,
          achievementApiNames: achievements.map((a) => a.apiName),
        },
      ];
    case GroupBy.Unlocked:
      return [
        {
          name: 'Achieved',
          achievementApiNames: achievements.filter((a) => a.unlocked).map((a) => a.apiName),
        },
        {
          name: 'Unachieved',
          achievementApiNames: achievements.filter((a) => !a.unlocked).map((a) => a.apiName),
        },
      ];
    default:
      return [];
  }
};

const AchievementContent: React.FC<{
  data: AchievementDataHook;
  settings: AchievementSettings;
  onSettingsChange: (settings: Partial<AchievementSettings> | null) => void;
  onCacheCleared: () => void;
  appId: string;
}> = ({ data, settings, onSettingsChange, onCacheCleared, appId }) => {
  const { groupBy, sortBy, expandAll } = settings;
  const groupedAchievements = getGroupedAchievements(data.achievements, data.groups, groupBy);

  // Initialize expandedGroups with all group indices
  const [expandedGroups, setExpandedGroups] = React.useState<Set<number>>(
    () => new Set(Array.from({ length: groupedAchievements.length }, (_, i) => i)),
  );

  const allGroupsExpanded = React.useMemo(() => {
    return expandedGroups.size === groupedAchievements.length;
  }, [expandedGroups, groupedAchievements.length]);

  React.useEffect(() => {
    if (expandAll !== allGroupsExpanded) {
      onSettingsChange({ expandAll: allGroupsExpanded });
    }
  }, [allGroupsExpanded, expandAll, onSettingsChange]);

  const handleGroupExpand = (index: number, isExpanded: boolean) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      return newSet;
    });
  };

  const handleExpandAllClick = () => {
    if (allGroupsExpanded) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(Array.from({ length: groupedAchievements.length }, (_, i) => i)));
    }
  };

  const getAchievementsForGroup = (apiNames: string[]) =>
    data.achievements.filter((achievement) => apiNames.includes(achievement.apiName));

  const calculateTotalPoints = (groupAchievements: AchievementData[]) =>
    groupAchievements.reduce((sum, achievement) => sum + achievement.points, 0);

  const getGroupDate = (index: number, group: AchievementGroupData) => {
    const dateString = data.achievementUpdates.find((update) => {
      if (settings.groupBy === GroupBy.Unlocked) {
        index = 0;
      }

      if (group.dlcAppId) {
        return update.dlcAppId === group.dlcAppId;
      }

      return update.updateNumber === index && update.dlcAppId === group.dlcAppId;
    })?.displayReleaseDate;

    return dateString ? new Date(dateString) : undefined;
  };

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
              key={index}
              groupInfo={group}
              title={group.name}
              achievements={groupAchievements}
              totalPoints={totalPoints}
              isExpanded={expandedGroups.has(index)}
              sortedBy={sortBy}
              showPoints={settings.showPoints}
              gameInfo={data.gameInfo}
              date={getGroupDate(index, group)}
              onExpandChange={(isExpanded) => handleGroupExpand(index, isExpanded)}
            />
          );
        })}
      </div>
    </>
  );
};

export const AchievementPage: React.FC<AchievementPageProps> = ({ appId }) => {
  const data = useAchievementData(appId);
  const [settings, setSettings] = useState<AchievementSettings>(() => {
    const savedSettings = getDefaultSettings();
    return savedSettings || defaultSettings;
  });

  const domElement = createRef<HTMLDivElement>();

  const handleSettingsChange = (newSettings: Partial<AchievementSettings> | null) => {
    if (newSettings === null) {
      setSettings(defaultSettings);
    } else {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    }
  };

  const handleCacheCleared = () => {
    data.reload();
  };

  if (data.errors.length > 0) {
    return <ErrorDisplay errors={data.errors} />;
  }

  useEffect(() => {
    if (!domElement.current) return;

    CreateCssElement(domElement.current.ownerDocument);
  }, []);

  return (
    <div className="steam-hunters-achievements-page" ref={domElement}>
      {data.loading ? (
        <Spinner className="steam-hunters-spinner" />
      ) : (
        <AchievementContent
          data={data}
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onCacheCleared={handleCacheCleared}
          appId={appId}
        />
      )}
    </div>
  );
};
