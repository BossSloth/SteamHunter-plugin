import React, { useRef } from 'react';
import { ControllerFocusable, SteamTooltip } from '../SteamComponents';
import { AchievementData, SortBy } from './types';
import { PointsIcon } from './Icons';

interface AchievementItemProps {
  achievement: AchievementData;
  sortedBy: SortBy;
  showPoints?: boolean;
}

const getRarityClass = (percentage: number): string => {
  if (percentage < 5) return 'Legendary';
  if (percentage < 10) return 'Epic';
  if (percentage < 20) return 'Rare';
  if (percentage < 50) return 'Uncommon';
  return 'Common';
};

const TooltipAchievementItem: React.FC<AchievementItemProps> = ({ achievement, sortedBy }) => {
  const rarityClass = getRarityClass(achievement.localPercentage);
  const usedPercentage = sortedBy === SortBy.Steam ? achievement.localPercentage: achievement.steamPercentage;

  return (
  <>
    <strong className={`steam-hunters-percentage ${rarityClass}`}>{rarityClass}</strong>
    <br />
    <span>{usedPercentage.toFixed(1)}% on {sortedBy === SortBy.Steam ? 'Steam Hunters' : 'Steam'}</span>
    <div className="steam-hunters-tooltip-arrow"></div>
  </>
  )
};

export const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, sortedBy, showPoints = true }) => {
  const toolTipDom = useRef<HTMLSpanElement>(null);
  const fakeMouseOver = new MouseEvent('mouseover', {bubbles: true});
  const fakeMouseOut = new MouseEvent('mouseout', {bubbles: true});

  const rarityClass = getRarityClass(achievement.localPercentage);

  const usedPercentage = sortedBy === SortBy.Steam ? achievement.steamPercentage: achievement.localPercentage;
  return (
    <ControllerFocusable 
      onOKActionDescription={null} 
      onGamepadFocus={() => {toolTipDom.current?.dispatchEvent(fakeMouseOver)}}
      onGamepadBlur={() => {toolTipDom.current?.dispatchEvent(fakeMouseOut)}}
    >
    <div className="achievement-item">
      <div className="left">
        <img className="achievement-image" alt={achievement.name} src={achievement.strImage}></img>
      </div>
      <div className="center">
        <div className="achievement-progress" style={{ width: `${usedPercentage}%` }} />
        <div className="achievement-content">
          <h3>{achievement.name}</h3>
          <p>{achievement.description}</p>
        </div>
        <div className="achievement-stats">
          {showPoints && (
            <span className="points">{achievement.points}<PointsIcon /></span>
          )}

          <SteamTooltip toolTipContent={<TooltipAchievementItem achievement={achievement} sortedBy={sortedBy} />} direction='top' nDelayShowMS={0} strTooltipClassname={'steam-hunters-percentage-tooltip'}>
            <span className={`steam-hunters-percentage ${rarityClass}`} ref={toolTipDom}>{usedPercentage.toFixed(1)}%</span>
          </SteamTooltip>
        </div>
      </div>
    </div>
    </ControllerFocusable>
  );
};
