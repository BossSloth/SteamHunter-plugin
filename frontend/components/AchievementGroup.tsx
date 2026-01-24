import { ProgressBar } from '@steambrew/client';
import React, { JSX, useMemo } from 'react';
import { ControllerFocusable } from '../SteamComponents';
import { useAchievementStore } from '../stores';
import { AchievementItem } from './AchievementItem';
import { AchievementIcon, PointsIcon } from './Icons';
import { AchievementData, AchievementGroupData, SteamGameInfo } from './types';

interface AchievementGroupProps {
  onExpandChange(isExpanded: boolean): void;

  readonly achievements: AchievementData[];
  readonly gameInfo: SteamGameInfo;
  readonly groupInfo: AchievementGroupData;
  readonly isExpanded?: boolean;
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
  gameInfo,
  onExpandChange,
}: AchievementGroupProps): JSX.Element => {
  const settings = useAchievementStore();

  const [expanded, setExpanded] = React.useState(isExpanded);

  React.useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  function handleExpand(newExpanded: boolean): void {
    setExpanded(newExpanded);
    onExpandChange(newExpanded);
  }

  const groupTitle = useMemo(() => {
    const { dlcAppName, name } = groupInfo;

    if (dlcAppName !== undefined) {
      return name !== undefined ? `${dlcAppName} — ${name}` : dlcAppName;
    }

    return title !== undefined ? `${gameInfo.name} — ${title}` : gameInfo.name;
  }, [groupInfo.dlcAppName, groupInfo.name, title, gameInfo.name]);

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
            {groupInfo.bannerUrl !== undefined && (
              <img
                src={groupInfo.bannerUrl}
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
              <div className={`progress-container ${fullCompleted ? 'progress-complete' : ''}`} style={{ display: settings.showUnlocked && achievements.length > 0 ? 'flex' : 'none' }}>
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
                {`${achievements.length} achievements${settings.showPoints ? ` worth ${totalPoints}` : ''}`}
                {settings.showPoints && <PointsIcon />}
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
            />
          ))}
        </div>
      )}
    </div>
  );
});
