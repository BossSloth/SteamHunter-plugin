import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { AchievementGroup } from './AchievementGroup';
import achievementsData from '../Data/achievements.json';
import groupsData from '../Data/achievement_groups.json';

type ApiName = string;

export interface Achievement {
  name: string;
  description: string;
  steamPercentage: number;
  points: number;
  localPercentage: number;
  apiName: ApiName;
  strImage: string;
}

interface AchievementGroup {
  name: string;
  achievementApiNames: ApiName[];
}

/*
Example SteamAchievementData object
{
    "strID": "ACH_ALPS",
    "strName": "Je Suis Perdu!",
    "strDescription": "You've had one heck of a ski holiday.",
    "bAchieved": true,
    "rtUnlocked": 1735426639,
    "strImage": "https://cdn.steamstatic.com/steamcommunity/public/images/apps/427410/e91840161b6907cd389c801e7b83aa2841000f6b.jpg",
    "bHidden": true,
    "flMinProgress": 0,
    "flCurrentProgress": 0,
    "flMaxProgress": 0,
    "flAchieved": 11.300000190734863
}
*/
interface SteamAchievementData {
  strID: string;
  strName: string;
  strDescription: string;
  bAchieved: boolean;
  rtUnlocked: number;
  strImage: string; // Image URL
  bHidden: boolean;
  flMinProgress: number;
  flCurrentProgress: number;
  flMaxProgress: number;
  flAchieved: number;
}

export enum SortBy {
  SteamHunters = 'SH%',
  Steam = 'Steam%',
  Name = 'Name',
  Default = 'Default'
}

export const AchievementPage: React.FC<{appId: string}> = ({appId}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [groups, setGroups] = useState<AchievementGroup[]>([]);
  const [groupBy, setGroupBy] = useState('dlcandupdate');
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.SteamHunters);
  const [reverse, setReverse] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  let timeStart;

  useEffect(() => {
    const loadData = async () => {
      try {
        const steamAchievements = (await SteamClient.Apps.GetMyAchievementsForApp(appId))?.data?.rgAchievements as SteamAchievementData[] ?? [];

        const updatedAchievements = achievementsData.map(achievement => {
          const steamAchievement = steamAchievements.find(sa => sa.strID === achievement.apiName);
          return {
            ...achievement,
            strImage: steamAchievement?.strImage || ''
          };
        });

        setAchievements(updatedAchievements);
        
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
    ).sort((a, b) => {
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

  const calculateTotalPoints = (groupAchievements: Achievement[]) => {
    return groupAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
  };

  return (
    <div className="steam-hunters-achievements-page">
      <Header
        onGroupingChange={setGroupBy}
        onSortChange={setSortBy}
        reverse={reverse}
        onReverseChange={setReverse}
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
              sortedBy={sortBy}
            />
          );
        })}
      </div>
    </div>
  );
};
