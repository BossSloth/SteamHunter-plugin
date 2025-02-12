import React from 'react';
import { SteamTooltip } from '../SteamComponents';
import { findClass } from '@steambrew/client';

interface Achievement {
  name: string;
  description: string;
  steamPercentage: number;
  points: number;
  localPercentage: number;
}

interface AchievementItemProps {
  achievement: Achievement;
}

const getRarityClass = (percentage: number): string => {
  if (percentage < 5) return 'Legendary';
  if (percentage < 10) return 'Epic';
  if (percentage < 20) return 'Rare';
  if (percentage < 50) return 'Uncommon';
  return 'Common';
};

const TooltipAchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  const rarityClass = getRarityClass(achievement.localPercentage);
  return (
  <>
    <strong className={`steam-hunters-percentage ${rarityClass}`}>{rarityClass}</strong>
    <br />
    <span>{achievement.steamPercentage.toFixed(1)}% on Steam</span>
    <div className="steam-hunters-tooltip-arrow"></div>
  </>
  )
};

export const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  const rarityClass = getRarityClass(achievement.localPercentage);

  return (
    <div className="achievement-item">
      <div className="achievement-content">
        <h3>{achievement.name}</h3>
        <p>{achievement.description}</p>
      </div>
      <div className="achievement-stats">
        <span className="points">{achievement.points}</span>
        {/* TODO: strTooltipClassname does not attach the class to the right div it needs to be onn _2FxbHJzYoH024ko7zqcJOf which is TextToolTip in the code make shit work */}
        <SteamTooltip toolTipContent={<TooltipAchievementItem achievement={achievement} />} direction='top' nDelayShowMS={0} strTooltipClassname={'steam-hunters-percentage-tooltip'}>
          <span className={`steam-hunters-percentage ${rarityClass}`}>{achievement.localPercentage.toFixed(1)}%</span>
        </SteamTooltip>
      </div>
    </div>
  );
};
