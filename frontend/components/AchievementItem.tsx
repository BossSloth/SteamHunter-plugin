/* eslint-disable react/no-multi-comp */

import React, { JSX, PropsWithChildren, useMemo, useRef } from 'react';
import { ControllerFocusable, SteamTooltip } from '../SteamComponents';
import { GuideIcon, PointsIcon, UsersIcon } from './Icons';
import { AchievementData, Obtainability, ObtainabilityNames, SortBy } from './types';

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
    </>
  );
}

export const AchievementItem = React.memo(({ achievement, sortedBy, showPoints = true }: AchievementItemProps): JSX.Element => {
  const toolTipDom = useRef<HTMLSpanElement>(null);

  const fakeMouseOver = useMemo(() => new MouseEvent('mouseover', { bubbles: true }), []);
  const fakeMouseOut = useMemo(() => new MouseEvent('mouseout', { bubbles: true }), []);

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
          <img className="achievement-image" alt={achievement.name} src={achievement.strImage} loading="lazy" decoding="async" />
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
              {achievement.obtainability !== Obtainability.Obtainable && (
                <span className={`obtainability ${Obtainability[achievement.obtainability]}`}>
                  {ObtainabilityNames[achievement.obtainability]}
                </span>
              )}
              {achievement.tags && Object.entries(achievement.tags).map(([tag, count]) => (
                <Tooltip
                  toolTipContent={`${tag} (${count} vote${count === 1 ? '' : 's'})`}
                  key={tag}
                >
                  <span className="achievement-tag">
                    {tag}
                  </span>
                </Tooltip>
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

              <Tooltip
                toolTipContent={<TooltipAchievementItem achievement={achievement} sortedBy={sortedBy} />}
              >
                <span className={`steam-hunters-percentage ${rarityClass}`} ref={toolTipDom}>
                  {`${usedPercentage.toFixed(1)}%`}
                </span>
              </Tooltip>
            </div>
            <div>
              {achievement.unlockedDate && (
                <Tooltip
                  toolTipContent={`Unlocked on ${achievement.unlockedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                >
                  <span className="unlocked-date">
                    {achievement.unlockedDate.toLocaleDateString()}
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </ControllerFocusable>
  );
});

export function Tooltip({ toolTipContent, children }: { readonly toolTipContent: React.ReactNode; } & PropsWithChildren): JSX.Element {
  const content = (
    <>
      {toolTipContent}
      <div className="steam-hunters-tooltip-arrow" />
    </>
  );

  return (
    <SteamTooltip
      toolTipContent={content}
      direction="top"
      nDelayShowMS={10}
      strTooltipClassname="steam-hunters-tooltip"
    >
      {children}
    </SteamTooltip>
  );
}
