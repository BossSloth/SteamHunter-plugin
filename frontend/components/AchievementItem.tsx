import React from 'react';
import { SteamTooltip } from '../SteamComponents';
import { AchievementData, SortBy } from './types';

interface AchievementItemProps {
  achievement: AchievementData;
  sortedBy: SortBy;
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

export const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, sortedBy }) => {
  const rarityClass = getRarityClass(achievement.localPercentage);

  const usedPercentage = sortedBy === SortBy.Steam ? achievement.steamPercentage: achievement.localPercentage;
  return (
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
          <span className="points">{achievement.points}</span>
          {/* TODO: Icon does not work */}
          <i area-label="Achievement point icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>star-circle</title><path d="M16.23,18L12,15.45L7.77,18L8.89,13.19L5.16,9.96L10.08,9.54L12,5L13.92,9.53L18.84,9.95L15.11,13.18L16.23,18M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg></i>

          <SteamTooltip toolTipContent={<TooltipAchievementItem achievement={achievement} sortedBy={sortedBy} />} direction='top' nDelayShowMS={0} strTooltipClassname={'steam-hunters-percentage-tooltip'}>
            <span className={`steam-hunters-percentage ${rarityClass}`}>{usedPercentage.toFixed(1)}%</span>
          </SteamTooltip>
        </div>
      </div>
    </div>
  );
};
