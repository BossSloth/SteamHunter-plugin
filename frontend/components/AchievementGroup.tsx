import { ProgressBar } from '@steambrew/client';
import React from 'react';
import { ControllerFocusable } from '../SteamComponents';
import { AchievementItem } from './AchievementItem';
import { AchievementIcon, PointsIcon } from './Icons';
import { AchievementData, AchievementGroupData, SortBy, SteamGameInfo } from './types';

interface AchievementGroupProps {
  onExpandChange(isExpanded: boolean): void;

  readonly achievements: AchievementData[];
  readonly gameInfo: SteamGameInfo;
  readonly groupInfo: AchievementGroupData;
  readonly isExpanded?: boolean;
  readonly showPoints?: boolean;
  readonly showUnlocked?: boolean;
  readonly sortedBy: SortBy;
  readonly title?: string;
  readonly totalPoints: number;
}

// eslint-disable-next-line max-lines-per-function
export function AchievementGroup({
  groupInfo,
  title,
  achievements,
  totalPoints,
  isExpanded = false,
  sortedBy,
  gameInfo,
  showPoints = true,
  showUnlocked = true,
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

  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);
  const progressPercentage = unlockedAchievements.length / achievements.length * 100;
  const fullCompleted = unlockedAchievements.length === achievements.length;

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
                  SteamClient.System.OpenInSystemBrowser(`https://steamhunters.com/apps/${gameInfo.appId}/achievements`);
                  e.stopPropagation();
                }}
              />
            )}
            <div className="group-title">
              <h2>{getTitle()}</h2>
              {/* Date will be formatted like this: "1 Jan 2025" */}
              {/* <span className="date">
                {new Date(gameInfo.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span> */}
              <div className={`progress-container ${fullCompleted ? 'progress-complete' : ''}`} style={{ display: showUnlocked && achievements.length > 0 ? 'flex' : 'none' }}>
                {fullCompleted && <AchievementIcon />}
                <div className="progress-text">
                  <span>{unlockedAchievements.length}</span>
                  <span>/</span>
                  <span>{achievements.length}</span>
                  <span>{` (${progressPercentage.toFixed(1)}%)`}</span>
                </div>
                <ProgressBar nProgress={progressPercentage} />
              </div>
            </div>
          </div>
          <div className="group-right">
            <div className="group-stats">
              <span>
                {`${achievements.length} achievements${showPoints ? ` worth ${totalPoints}` : ''}`}
                {showPoints && <PointsIcon />}
              </span>
              <span className="expand-button">{expanded ? '▼' : '▶'}</span>
            </div>
          </div>
        </div>
      </ControllerFocusable>
      {expanded && (
        <div className="group-content">
          {achievements.map(achievement => (
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
