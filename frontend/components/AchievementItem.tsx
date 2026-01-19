/* eslint-disable max-lines-per-function */
import React, { JSX, useRef } from 'react';
import { ControllerFocusable, SteamTooltip } from '../SteamComponents';
import { GuideIcon, PointsIcon, UsersIcon } from './Icons';
import { AchievementData, SortBy } from './types';

interface AchievementItemProps {
  readonly achievement: AchievementData;
  // eslint-disable-next-line react/no-unused-prop-types
  readonly showPoints?: boolean;
  readonly sortedBy: SortBy;
}

function getRarityClass(percentage: number): string {
  if (percentage < 5) return 'Legendary';
  if (percentage < 10) return 'Epic';
  if (percentage < 20) return 'Rare';
  if (percentage < 50) return 'Uncommon';

  return 'Common';
}

function TooltipAchievementItem({ achievement, sortedBy }: AchievementItemProps): JSX.Element {
  const rarityClass = getRarityClass(achievement.localPercentage);
  const usedPercentage = sortedBy === SortBy.Steam ? achievement.localPercentage : achievement.steamPercentage;

  return (
    <>
      <strong className={`steam-hunters-percentage ${rarityClass}`}>{rarityClass}</strong>
      <br />
      <span>
        {usedPercentage.toFixed(1)}% on {sortedBy === SortBy.Steam ? 'Steam Hunters' : 'Steam'}
      </span>
      <div className="steam-hunters-tooltip-arrow" />
    </>
  );
}

// eslint-disable-next-line react/no-multi-comp
export function AchievementItem({ achievement, sortedBy, showPoints = true }: AchievementItemProps): JSX.Element {
  const toolTipDom = useRef<HTMLSpanElement>(null);
  const fakeMouseOver = new MouseEvent('mouseover', { bubbles: true });
  const fakeMouseOut = new MouseEvent('mouseout', { bubbles: true });

  const rarityClass = getRarityClass(achievement.localPercentage);

  const usedPercentage = sortedBy === SortBy.Steam ? achievement.steamPercentage : achievement.localPercentage;

  return (
    <ControllerFocusable
      onOKActionDescription={null}
      onGamepadFocus={() => {
        toolTipDom.current?.dispatchEvent(fakeMouseOver);
      }}
      onGamepadBlur={() => {
        toolTipDom.current?.dispatchEvent(fakeMouseOut);
      }}
    >
      <div className="achievement-item">
        <div className="left">
          <img className="achievement-image" alt={achievement.name} src={achievement.strImage} />
        </div>
        <div className="center">
          <div className={`achievement-progress ${achievement.unlocked ? 'unlocked' : 'locked'}`} style={{ width: `${usedPercentage}%` }} />
          <div className="achievement-content">
            <h3>{achievement.name}</h3>
            <p>{achievement.description !== '' ? achievement.description : 'This achievement has no description.'}</p>
            <div className="achievement-extra-info">
              {achievement.guideUrl !== undefined && (
                <a
                  className="guide-link"
                  href={achievement.guideUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    if (achievement.guideUrl !== undefined && achievement.guideUrl !== '') {
                      SteamClient.System.OpenInSystemBrowser(achievement.guideUrl);
                    }
                  }}
                >
                  <GuideIcon />
                  Guide
                </a>
              )}
              {achievement.completedCount !== undefined && achievement.totalPlayers !== undefined && (
                <span className="completed-count">
                  <UsersIcon />
                  {achievement.completedCount.toLocaleString()} / {achievement.totalPlayers.toLocaleString()}
                </span>
              )}
              {achievement.tags && Object.entries(achievement.tags).map(([tag, count]) => (
                <SteamTooltip
                  toolTipContent={`${tag} (${count} vote${count === 1 ? '' : 's'})`}
                  direction="top"
                  nDelayShowMS={5}
                  strTooltipClassname="steam-hunters-percentage-tooltip"
                  key={tag}
                >
                  <span className="achievement-tag">
                    {tag}
                  </span>
                </SteamTooltip>
              ))}
            </div>
          </div>
          <div className="right">
            <div className="achievement-stats">
              {showPoints && (
                <span className="points">
                  {achievement.points.toLocaleString()}
                  <PointsIcon />
                </span>
              )}

              <SteamTooltip
                toolTipContent={<TooltipAchievementItem achievement={achievement} sortedBy={sortedBy} />}
                direction="top"
                nDelayShowMS={5}
                strTooltipClassname="steam-hunters-percentage-tooltip"
              >
                <span className={`steam-hunters-percentage ${rarityClass}`} ref={toolTipDom}>
                  {`${usedPercentage.toFixed(1)}%`}
                </span>
              </SteamTooltip>
            </div>
            <div>
              {achievement.unlockedDate && (
                <SteamTooltip
                  toolTipContent={`Unlocked on ${achievement.unlockedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                  direction="top"
                  nDelayShowMS={5}
                  strTooltipClassname="steam-hunters-percentage-tooltip"
                >
                  <span className="unlocked-date">
                    {achievement.unlockedDate.toLocaleDateString()}
                  </span>
                </SteamTooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </ControllerFocusable>
  );
}
