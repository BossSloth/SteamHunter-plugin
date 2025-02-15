import React from 'react';
import { AchievementItem } from './AchievementItem';
import { AchievementData, SortBy, SteamGameInfo } from './types';

interface AchievementGroupProps {
  title: string;
  date?: Date;
  achievements: AchievementData[];
  totalPoints: number;
  isExpanded?: boolean;
  sortedBy: SortBy;
  gameInfo: SteamGameInfo;
  dlcAppId?: number;
}

export const AchievementGroup: React.FC<AchievementGroupProps> = ({
  title,
  date,
  achievements,
  totalPoints,
  isExpanded = false,
  sortedBy,
  gameInfo,
  dlcAppId,
}) => {
  const [expanded, setExpanded] = React.useState(isExpanded);

  const getTitle = () => {
    if (dlcAppId) {
      return title;
    } else if (title) {
      return `${gameInfo.name} — ${title}`;
    } else {
      return `${gameInfo.name}`;
    }
  }

  const getImageUrl = () => {
    const appId = dlcAppId || gameInfo.appId;
    return appId ? `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/capsule_184x69.jpg` : null;
  };

  return (
    <div className="achievement-group">
      <div className="group-header" onClick={() => setExpanded(!expanded)}>
        <div className="group-info">
          {getImageUrl() && (
            <img 
              src={getImageUrl()} 
              alt={getTitle()} 
              className="group-image"
            />
          )}
          <div className="group-title">
            <h2>{getTitle()}</h2>
            {/* Date will be formatted like this: "1 Jan 2025" */}
            {date && <span className="date">{date.toLocaleDateString(undefined, {year:"numeric", month:"short", day:"numeric"})}</span>}
          </div>
        </div>
        <div className="group-stats">
          <span>{achievements.length} achievements worth {totalPoints}</span>
          <span className="expand-button">
            {expanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      {expanded && (
        <div className="group-content">
          {achievements.map((achievement, index) => (
            <AchievementItem
              key={index}
              achievement={achievement}
              sortedBy={sortedBy}
            />
          ))}
        </div>
      )}
    </div>
  );
};
