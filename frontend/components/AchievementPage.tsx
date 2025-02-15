import React from 'react';
import { Header } from './Header';
import { AchievementGroup } from './AchievementGroup';
import { Spinner } from '@steambrew/client';
import { AchievementData, AchievementGroupData, AchievementSettings, GroupBy, SortBy } from './types';
import { AchievementDataHook, useAchievementData } from '../hooks/useAchievementData';
import { ErrorDisplay } from './ErrorDisplay';

interface AchievementPageProps {
  appId: string;
}

const defaultSettings: AchievementSettings = {
  groupBy: GroupBy.DLCAndUpdate,
  sortBy: SortBy.SteamHunters,
  reverse: false,
  expandAll: true,
  showUnlocked: true,
  showPoints: true
};

const filterAndSortAchievements = (achievements: AchievementData[], settings: AchievementSettings) => {
  const { sortBy, reverse, showUnlocked } = settings;
  
  return achievements
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
    })
    .filter(achievement => showUnlocked || !achievement.unlocked);
};

const getGroupedAchievements = (
  achievements: AchievementData[],
  groups: AchievementGroupData[],
  groupBy: GroupBy
): AchievementGroupData[] => {
  if (!groups || !achievements) return [];

  switch (groupBy) {
    case GroupBy.DLCAndUpdate:
      return groups.map(group => ({
        ...group,
        // Fix all broken &nbsp; characters
        name: (group.name?.replace('Â', '\u00A0') ?? group.dlcAppName?.replace('Â', '\u00A0')),
      }));
    case GroupBy.Nothing:
      return [{
        name: null,
        achievementApiNames: achievements.map(a => a.apiName)
      }];
    case GroupBy.Unlocked:
      return [
        {
          name: "Achieved",
          achievementApiNames: achievements.filter(a => a.unlocked).map(a => a.apiName)
        },
        {
          name: "Unachieved",
          achievementApiNames: achievements.filter(a => !a.unlocked).map(a => a.apiName)
        }
      ];
    default:
      return [];
  }
};

const AchievementContent: React.FC<{
  data: AchievementDataHook;
  settings: AchievementSettings;
  onSettingsChange: (settings: Partial<AchievementSettings>) => void
}> = ({ data, settings, onSettingsChange }) => {
  const { groupBy, sortBy, expandAll } = settings;
  const [expandedGroups, setExpandedGroups] = React.useState<Set<number>>(new Set());

  const allGroupsExpanded = React.useMemo(() => {
    const groupedAchievements = getGroupedAchievements(data.achievements, data.groups, groupBy);
    return expandedGroups.size === groupedAchievements.length;
  }, [expandedGroups, data.achievements, data.groups, groupBy]);

  React.useEffect(() => {
    if (expandAll !== allGroupsExpanded) {
      onSettingsChange({ expandAll: allGroupsExpanded });
    }
  }, [allGroupsExpanded, expandAll, onSettingsChange]);

  const handleGroupExpand = (index: number, isExpanded: boolean) => {
    setExpandedGroups(prev => {
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
    const groupedAchievements = getGroupedAchievements(data.achievements, data.groups, groupBy);
    if (allGroupsExpanded) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(Array.from({ length: groupedAchievements.length }, (_, i) => i)));
    }
  };

  const getAchievementsForGroup = (apiNames: string[]) => 
    data.achievements.filter(achievement => apiNames.includes(achievement.apiName));

  const calculateTotalPoints = (groupAchievements: AchievementData[]) =>
    groupAchievements.reduce((sum, achievement) => sum + achievement.points, 0);

  const getGroupDate= (index: number, group: AchievementGroupData) => {
    const dateString = data.achievementUpdates.find(update => {
      if (settings.groupBy === GroupBy.Unlocked) {
        index = 0;
      }

      if (group.dlcAppId) {
        return update.dlcAppId === group.dlcAppId
      }

      return update.updateNumber === index && update.dlcAppId === group.dlcAppId
    })?.displayReleaseDate;

    return dateString ? new Date(dateString) : null;
  }

  const groupedAchievements = getGroupedAchievements(data.achievements, data.groups, groupBy);

  return (
    <>
      <Header
        settings={settings}
        onSettingsChange={onSettingsChange}
        achievementCount={data.achievements.length}
        groupCount={groupedAchievements.length}
        onExpandAllClick={handleExpandAllClick}
      />
      
      <div className="achievement-groups">
        {groupedAchievements.map((group, index) => {
          const groupAchievements = filterAndSortAchievements(
            getAchievementsForGroup(group.achievementApiNames),
            settings
          );
          const totalPoints = calculateTotalPoints(groupAchievements);
          
          return (
            <AchievementGroup
              key={index}
              title={group.name}
              achievements={groupAchievements}
              totalPoints={totalPoints}
              isExpanded={expandedGroups.has(index)}
              sortedBy={sortBy}
              showPoints={settings.showPoints}
              gameInfo={data.gameInfo}
              dlcAppId={group.dlcAppId}
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
  const [settings, setSettings] = React.useState<AchievementSettings>(defaultSettings);

  const handleSettingsChange = (newSettings: Partial<AchievementSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  if (data.errors.length > 0) {
    return <ErrorDisplay errors={data.errors} />;
  }

  return (
    <div className="steam-hunters-achievements-page">
      {data.loading ? (
        <Spinner className='steam-hunters-spinner' />
      ) : (
        <AchievementContent
          data={data}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}
    </div>
  );
};
