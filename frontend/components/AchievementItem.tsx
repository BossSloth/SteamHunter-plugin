import React, { useRef } from 'react';
import { ControllerFocusable, SteamTooltip } from '../SteamComponents';
import { PointsIcon } from './Icons';
import { AchievementData, SortBy } from './types';

interface AchievementItemProps {
  readonly achievement: AchievementData;
  readonly sortedBy: SortBy;
  // eslint-disable-next-line react/no-unused-prop-types
  readonly showPoints?: boolean;
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
          <div className="achievement-progress" style={{ width: `${usedPercentage}%` }} />
          <div className="achievement-content">
            <h3>{achievement.name}</h3>
            <p>{achievement.description}</p>
          </div>
          <div className="achievement-stats">
            {showPoints && (
              <span className="points">
                {achievement.points}
                <PointsIcon />
              </span>
            )}

            <SteamTooltip
              toolTipContent={<TooltipAchievementItem achievement={achievement} sortedBy={sortedBy} />}
              direction="top"
              nDelayShowMS={0}
              strTooltipClassname="steam-hunters-percentage-tooltip"
            >
              <span className={`steam-hunters-percentage ${rarityClass}`} ref={toolTipDom}>
                {`${usedPercentage.toFixed(1)}%`}
              </span>
            </SteamTooltip>
          </div>
        </div>
      </div>
    </ControllerFocusable>
  );
}
