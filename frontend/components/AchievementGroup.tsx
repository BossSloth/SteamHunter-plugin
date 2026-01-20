import { ProgressBar } from '@steambrew/client';
import React, { JSX, useMemo } from 'react';
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
export const AchievementGroup = React.memo(({
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
}: AchievementGroupProps): JSX.Element => {
  const [expanded, setExpanded] = React.useState(isExpanded);

  React.useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  function handleExpand(newExpanded: boolean): void {
    setExpanded(newExpanded);
    onExpandChange(newExpanded);
  }

  const groupTitle = useMemo(() => {
    if (groupInfo.dlcAppId !== undefined) {
      if (groupInfo.name !== undefined) {
        return `${groupInfo.dlcAppName} — ${groupInfo.name}`;
      }

      return `${groupInfo.dlcAppName}`;
    } else if (title !== undefined) {
      return `${gameInfo.name} — ${title}`;
    }

    return gameInfo.name;
  }, [groupInfo.dlcAppId, groupInfo.dlcAppName, groupInfo.name, title, gameInfo.name]);

  // TODO: Add StoreItemCache in SteamTypes
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const imageUrl: string | undefined = useMemo(() => {
    const appId = groupInfo.dlcAppId ?? gameInfo.appId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    return (StoreItemCache as any).GetApp(appId)?.m_Assets?.m_strSmallCapsuleURL ?? `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/capsule_184x69.jpg`;
  }, [groupInfo.dlcAppId, gameInfo.appId]);

  // Memoize progress calculations
  const { unlockedCount, progressPercentage, fullCompleted } = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;

    return {
      unlockedCount: unlocked,
      progressPercentage: achievements.length > 0 ? (unlocked / achievements.length) * 100 : 0,
      fullCompleted: unlocked === achievements.length && achievements.length > 0,
    };
  }, [achievements]);

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
            {imageUrl !== undefined && (
              <img
                src={imageUrl}
                alt={groupTitle}
                className="group-image"
                onClick={(e) => {
                  SteamClient.System.OpenInSystemBrowser(`https://steamhunters.com/apps/${gameInfo.appId}/achievements`);
                  e.stopPropagation();
                }}
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="group-title">
              <div className="group-title-row">
                <span className="group-title-text">{groupTitle}</span>
                {/* Date will be formatted like this: "1 Jan 2025" */}
                {groupInfo.releaseDate && (
                  <span className="date">
                    {groupInfo.releaseDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
              <div className={`progress-container ${fullCompleted ? 'progress-complete' : ''}`} style={{ display: showUnlocked && achievements.length > 0 ? 'flex' : 'none' }}>
                {fullCompleted && <AchievementIcon />}
                <div className="progress-text">
                  <span>{unlockedCount}</span>
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
});
