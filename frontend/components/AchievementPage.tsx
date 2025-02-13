import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { AchievementGroup } from './AchievementGroup';
// import groupsData from '../Data/achievement_groups.json';
import { callable, IconsModule, sleep, Spinner, SteamSpinner } from '@steambrew/client';
import { AchievementData, AchievementGroupData, ApiName, RequestAchievementGroupsResponse, SortBy, SteamAchievementData, GroupBy } from './types';

const RequestAchievementGroups = callable<[{appId: string}], string>('RequestAchievementGroups');
const RequestAchievements = callable<[{appId: string}], string>('RequestAchievements');

export const AchievementPage: React.FC<{appId: string}> = ({appId}) => {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [groups, setGroups] = useState<AchievementGroupData[]>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.DLCAndUpdate);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.SteamHunters);
  const [reverse, setReverse] = useState(false);
  const [expandAll, setExpandAll] = useState(true);
  const [showUnlocked, setShowUnlocked] = useState(true);
  const [ViewError, setViewError] = useState<null | Error>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groupsData, achievementsData, steamAchievements] = await Promise.all([
          getGroups(),
          getAchievements(),
          // NOTE: We currently call this to get the achievement icons but this api return MY achievement icons meaning it will be gray if they are not achieved
          SteamClient.Apps.GetMyAchievementsForApp(appId).then((res: any) => res?.data?.rgAchievements) as SteamAchievementData[]
        ]);
        if (!groupsData) {
          throw new Error('Failed to load groups');
        }
        if (!achievementsData) {
          throw new Error('Failed to load achievements');
        }
        if (!steamAchievements) {
          throw new Error('Failed to load Steam achievements');
        }

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

        setAchievements(updatedAchievements);
        
        // Create base game group by finding achievements not in any group
        const allGroupAchievements = new Set(
          groupsData.flatMap(group => group.achievementApiNames)
        );
        
        const baseGameAchievements = achievementsData
          .filter(achievement => !allGroupAchievements.has(achievement.apiName))
          .map(achievement => achievement.apiName);

        const baseGameGroup: AchievementGroupData = {
          name: "Base Game",
          achievementApiNames: baseGameAchievements
        };  

        setGroups([baseGameGroup, ...groupsData]);
      } catch (error) {
        console.error('Error loading achievement data:', error);
        setViewError(error);
      }
    };

    loadData();
  }, []);

  const getGroups = async (): Promise<AchievementGroupData[]|null> => {
    try {
      console.log('Requesting groups')
      const response = JSON.parse(await RequestAchievementGroups({appId})) as RequestAchievementGroupsResponse;
      if (!response) {
        throw new Error('Invalid response: ' + JSON.stringify(response)); 
      }
      // @ts-ignore
      if (response?.error) {
        // @ts-ignore
        throw new Error(response.error);
      }
      return response.groups;
    } catch (error) {
      console.error('Error fetching achievement groups:', error);
      setViewError(error);
    }
      return null;
  }

  const getAchievements = async (): Promise<AchievementData[]|null> => {
    try {
      const response = JSON.parse(await RequestAchievements({appId})) as AchievementData[];
      if (!response) {
        throw new Error('Invalid response: ' + JSON.stringify(response)); 
      }
      // @ts-ignore
      if (response?.error) {
        // @ts-ignore
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setViewError(error);
    }
    return null;
  }

  const getAchievementsForGroup = (groupAchievementApiNames: ApiName[]) => {
    return achievements.filter(achievement => 
      groupAchievementApiNames.includes(achievement.apiName)
    );
  };

  const filterAchievements = (groupAchievements: AchievementData[]) => {
    return groupAchievements.sort((a, b) => {
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
    }).filter(achievement => showUnlocked || !achievement.unlocked);
  };

  const calculateTotalPoints = (groupAchievements: AchievementData[]) => {
    return groupAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
  };

  const getGroupedAchievements = () => {
    if (!groups || !achievements) return [];

    switch (groupBy) {
      case GroupBy.DLCAndUpdate:
        return groups;
      case GroupBy.Nothing:
        return [{
          name: "All Achievements",
          achievementApiNames: achievements.map(a => a.apiName)
        }];
      case GroupBy.Unlocked:
        const unlockedGroup = {
          name: "Unlocked Achievements",
          achievementApiNames: achievements.filter(a => a.unlocked).map(a => a.apiName)
        };
        const lockedGroup = {
          name: "Locked Achievements",
          achievementApiNames: achievements.filter(a => !a.unlocked).map(a => a.apiName)
        };
        return [unlockedGroup, lockedGroup];
      default:
        return [];
    }
  };

  return (<>
    {ViewError !== null ? (
      <div className="steam-hunters-error-message">
        <IconsModule.ExclamationPoint />
        <p>
          An error occurred: "{ViewError.message}". <br />
          Please try again later or create an issue on GitHub with your browser logs/console output attached.
        </p>
      </div>
    ) : (
      <div className="steam-hunters-achievements-page">
        {groups === null ? <Spinner className='steam-hunters-spinner' /> : (
        <>
          <Header
            onGroupingChange={setGroupBy}
            onSortChange={setSortBy}
            reverse={reverse}
            onReverseChange={setReverse}
            onExpandAllClick={() => setExpandAll(!expandAll)}
            showUnlocked={showUnlocked}
            onShowUnlockedChange={setShowUnlocked}
            groupBy={groupBy}
          />
          
          <div className="achievement-groups">
            {getGroupedAchievements().map((group, index) => {
              const groupAchievements = filterAchievements(getAchievementsForGroup(group.achievementApiNames));
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
        </>
        )}
      </div>
    )}
  </>);
};
