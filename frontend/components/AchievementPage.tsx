import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { AchievementGroup } from './AchievementGroup';
import achievementsData from '../Data/achievements.json';
import groupsData from '../Data/achievement_groups.json';

type ApiName = string;

interface Achievement {
  name: string;
  description: string;
  steamPercentage: number;
  points: number;
  localPercentage: number;
  apiName: ApiName;
}

interface AchievementGroup {
  name: string;
  achievementApiNames: ApiName[];
}

export const AchievementPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [groups, setGroups] = useState<AchievementGroup[]>([]);
  const [groupBy, setGroupBy] = useState('dlcandupdate');
  const [sortBy, setSortBy] = useState('sh');
  const [reverse, setReverse] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setAchievements(achievementsData);
        
        // Create base game group by finding achievements not in any group
        const allGroupAchievements = new Set(
          groupsData.groups.flatMap(group => group.achievementApiNames)
        );
        
        const baseGameAchievements = achievementsData
          .filter(achievement => !allGroupAchievements.has(achievement.apiName))
          .map(achievement => achievement.apiName);

        const baseGameGroup: AchievementGroup = {
          name: "Base Game",
          achievementApiNames: baseGameAchievements
        };

        setGroups([baseGameGroup, ...groupsData.groups]);
      } catch (error) {
        console.error('Error loading achievement data:', error);
      }
    };

    loadData();
  }, []);

  const getAchievementsForGroup = (groupAchievementApiNames: ApiName[]) => {
    return achievements.filter(achievement => 
      groupAchievementApiNames.includes(achievement.apiName)
    );
  };

  const calculateTotalPoints = (groupAchievements: Achievement[]) => {
    return groupAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
  };

  return (
    <div className="steam-hunters-achievements-page">
      <Header
        onGroupingChange={setGroupBy}
        onSortChange={setSortBy}
        onCompareClick={() => {/* Implement compare functionality */}}
        onExpandAllClick={() => setExpandAll(!expandAll)}
      />
      
      <div className="achievement-groups">
        {groups.map((group, index) => {
          const groupAchievements = getAchievementsForGroup(group.achievementApiNames);
          const totalPoints = calculateTotalPoints(groupAchievements);
          
          return (
            <AchievementGroup
              key={index}
              title={group.name}
              achievements={groupAchievements}
              totalPoints={totalPoints}
              isExpanded={expandAll}
            />
          );
        })}
      </div>
    </div>
  );
};
