import React from 'react';
import { AchievementItem } from './AchievementItem';
import { Achievement, SortBy } from './AchievementPage';

interface AchievementGroupProps {
  title: string;
  date?: string;
  achievements: Achievement[];
  totalPoints: number;
  isExpanded?: boolean;
  sortedBy: SortBy;
}

export const AchievementGroup: React.FC<AchievementGroupProps> = ({
  title,
  date,
  achievements,
  totalPoints,
  isExpanded = false,
  sortedBy,
}) => {
  const [expanded, setExpanded] = React.useState(isExpanded);

  return (
    <div className="achievement-group">
      <div className="group-header" onClick={() => setExpanded(!expanded)}>
        <div className="group-title">
          <h2>{title}</h2>
          {date && <span className="date">{date}</span>}
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
