import React from 'react';
import { ControllerFocusable } from '../SteamComponents';
import { AchievementItem } from './AchievementItem';
import { PointsIcon } from './Icons';
import { AchievementData, AchievementGroupData, SortBy, SteamGameInfo } from './types';

interface AchievementGroupProps {
  onExpandChange(isExpanded: boolean): void;

  readonly groupInfo: AchievementGroupData;
  readonly title?: string;
  readonly date?: Date;
  readonly achievements: AchievementData[];
  readonly totalPoints: number;
  readonly isExpanded?: boolean;
  readonly sortedBy: SortBy;
  readonly gameInfo: SteamGameInfo;
  readonly showPoints?: boolean;
}

export function AchievementGroup({
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
}: AchievementGroupProps): JSX.Element {
  const [expanded, setExpanded] = React.useState(isExpanded);

  React.useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  function handleExpand(newExpanded: boolean): void {
    setExpanded(newExpanded);
    onExpandChange(newExpanded);
  }

  function getTitle(): string {
    if (groupInfo.dlcAppId !== undefined) {
      if (groupInfo.name !== undefined) {
        return `${groupInfo.dlcAppName} — ${groupInfo.name}`;
      }

      return `${groupInfo.dlcAppName}`;
    } else if (title !== undefined) {
      return `${gameInfo.name} — ${title}`;
    }

    return gameInfo.name;
  }

  function getImageUrl(): string | undefined {
    const appId = groupInfo.dlcAppId ?? gameInfo.appId;

    return appId ? `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/capsule_184x69.jpg` : undefined;
  }

  return (
    <div className="achievement-group">
      <ControllerFocusable
        onClick={() => {
          handleExpand(!expanded);
        }}
        onOKActionDescription={expanded ? 'Collapse' : 'Expand'}
      >
        <div className="group-header">
          <div className="group-info">
            {getImageUrl() !== undefined && (
              <img
                src={getImageUrl()}
                alt={getTitle()}
                className="group-image"
                onClick={(e) => {
                  // TODO: use steam-types
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                  SteamClient.System.OpenInSystemBrowser(`https://steamhunters.com/apps/${gameInfo.appId}/achievements`);
                  e.stopPropagation();
                }}
              />
            )}
            <div className="group-title">
              <h2>{getTitle()}</h2>
              {/* Date will be formatted like this: "1 Jan 2025" */}
              {date && (
                <span className="date">
                  {date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
          <div className="group-stats">
            <span>
              {`${achievements.length} achievements${showPoints ? ` worth ${totalPoints}` : null}`}
              {showPoints && <PointsIcon />}
            </span>
            <span className="expand-button">{expanded ? '▼' : '▶'}</span>
          </div>
        </div>
      </ControllerFocusable>
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
}
