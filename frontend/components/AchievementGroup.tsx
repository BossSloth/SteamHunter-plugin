import React from 'react';
import { AchievementItem } from './AchievementItem';
import { AchievementData, AchievementGroupData, SortBy, SteamGameInfo } from './types';
import { PointsIcon } from './Icons';

interface AchievementGroupProps {
  groupInfo: AchievementGroupData;
  title: string;
  date?: Date;
  achievements: AchievementData[];
  totalPoints: number;
  isExpanded?: boolean;
  sortedBy: SortBy;
  gameInfo: SteamGameInfo;
  showPoints?: boolean;
  onExpandChange: (isExpanded: boolean) => void;
}

export const AchievementGroup: React.FC<AchievementGroupProps> = ({
  groupInfo,
  title,
  date,
  achievements,
  totalPoints,
  isExpanded = false,
  sortedBy,
  gameInfo,
  showPoints = true,
  onExpandChange,
}) => {
  const [expanded, setExpanded] = React.useState(isExpanded);

  React.useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  const handleExpand = (newExpanded: boolean) => {
    setExpanded(newExpanded);
    onExpandChange(newExpanded);
  };

  const getTitle = () => {
    if (groupInfo.dlcAppId) {
      if (groupInfo.name) {
        return `${groupInfo.dlcAppName} — ${groupInfo.name}`;
      }
      return `${groupInfo.dlcAppName}`;
    } else if (title) {
      return `${gameInfo.name} — ${title}`;
    } else {
      return `${gameInfo.name}`;
    }
  }

  const getImageUrl = () => {
    const appId = groupInfo.dlcAppId || gameInfo.appId;
    return appId ? `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/capsule_184x69.jpg` : null;
  };

  return (
    <div className="achievement-group">
      <div className="group-header" onClick={() => handleExpand(!expanded)}>
        <div className="group-info">
          {getImageUrl() && (
            <img 
              src={getImageUrl()} 
              alt={getTitle()} 
              className="group-image"
              onClick={(e) => {SteamClient.System.OpenInSystemBrowser(`https://steamhunters.com/apps/${gameInfo.appId}/achievements`); e.stopPropagation();}}
            />
          )}
          <div className="group-title">
            <h2>{getTitle()}</h2>
            {/* Date will be formatted like this: "1 Jan 2025" */}
            {date && <span className="date">{date.toLocaleDateString(undefined, {year:"numeric", month:"short", day:"numeric"})}</span>}
          </div>
        </div>
        <div className="group-stats">
          <span>{achievements.length} achievements{showPoints && ` worth ${totalPoints}`}{showPoints && <PointsIcon />}</span>
          <span className="expand-button">
            {expanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      {expanded && (
        <div className="group-content">
          {achievements.map((achievement) => (
            <AchievementItem
              key={achievement.apiName}
              achievement={achievement}
              sortedBy={sortedBy}
              showPoints={showPoints}
            />
          ))}
        </div>
      )}
    </div>
  );
};
