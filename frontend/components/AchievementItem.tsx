import React, { JSX, useEffect, useRef } from 'react';
import { ControllerFocusable } from '../SteamComponents';
import { useAchievementStore } from '../stores';
import { GuideIcon, PointsIcon, UsersIcon } from './Icons';
import { Tooltip, TooltipRef } from './Tooltip';
import { AchievementData, AchievementSettings, Obtainability, ObtainabilityNames, SortBy } from './types';

interface AchievementItemProps {
  readonly achievement: AchievementData;
}

function getRarityClass(percentage: number): string {
  if (percentage < 5) return 'Legendary';
  if (percentage < 10) return 'Epic';
  if (percentage < 20) return 'Rare';
  if (percentage < 50) return 'Uncommon';

  return 'Common';
}

function AchievementDescription({ isHidden, achievement }: { readonly isHidden: boolean; readonly achievement: AchievementData; }): JSX.Element {
  if (isHidden) {
    return <p>Details for this achievement will be revealed once unlocked</p>;
  }

  return <p>{achievement.description !== '' ? achievement.description : 'This achievement has no description.'}</p>;
}

function AchievementExtraInfo({
  achievement,
  settings,
}: {
  readonly achievement: AchievementData;
  readonly settings: AchievementSettings;
}): JSX.Element | null {
  return (
    <div className="achievement-extra-info">
      {settings.showGuides && achievement.guideUrl !== undefined && (
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
      {settings.showPlayerCount && achievement.completedCount !== undefined && achievement.totalPlayers !== undefined && (
        <span className="completed-count">
          <UsersIcon />
          {achievement.completedCount.toLocaleString()} / {achievement.totalPlayers.toLocaleString()}
        </span>
      )}
      {settings.showObtainability && achievement.obtainability !== Obtainability.Obtainable && (
        <span className={`obtainability ${Obtainability[achievement.obtainability]}`}>
          {ObtainabilityNames[achievement.obtainability]}
        </span>
      )}
      {settings.showTags && achievement.tags && Object.entries(achievement.tags).map(([tag, count]) => (
        <Tooltip
          toolTipContent={`${tag} (${count} vote${count === 1 ? '' : 's'})`}
          showTooltipOnContollerFocus={false}
          key={tag}
        >
          <span className="achievement-tag">
            {tag}
          </span>
        </Tooltip>
      ))}
    </div>
  );
}

function TooltipAchievementItem({ achievement, sortedBy }: { readonly achievement: AchievementData; readonly sortedBy: SortBy; }): JSX.Element {
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

export const AchievementItem = React.memo(({ achievement }: AchievementItemProps): JSX.Element => {
  const settings = useAchievementStore();
  const [revealed, setRevealed] = React.useState(false);
  const percentageTooltipRef = useRef<TooltipRef>(null);

  const rarityClass = getRarityClass(achievement.localPercentage);
  const usedPercentage = settings.sortBy === SortBy.Steam ? achievement.steamPercentage : achievement.localPercentage;

  useEffect(() => {
    setRevealed(false);
  }, [settings.hideHidden]);

  const isHidden
    = !revealed
      && settings.hideHidden
      && achievement.isHidden
      && !achievement.unlocked;

  function handleReveal(): void {
    if (isHidden) {
      setRevealed(true);
    }
  }

  return (
    <ControllerFocusable
      onOKActionDescription={isHidden ? 'Reveal' : null}
      onClick={handleReveal}
      onGamepadFocus={() => {
        percentageTooltipRef.current?.show();
      }}
      onGamepadBlur={() => {
        percentageTooltipRef.current?.hide();
      }}
    >
      <div className="achievement-item">
        <div className="left">
          <img
            className="achievement-image"
            alt={achievement.name}
            src={achievement.strImage}
            style={isHidden ? { filter: 'blur(5px)' } : {}}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="center">
          <div className={`achievement-progress ${achievement.unlocked ? 'unlocked' : 'locked'}`} style={{ width: `${usedPercentage}%` }} />
          <div className="achievement-content">
            <div className={`achievement-inner-content ${isHidden ? 'is-spoiler' : ''}`}>
              <h3>{isHidden ? 'Hidden Achievement' : achievement.name}</h3>
              <AchievementDescription isHidden={isHidden} achievement={achievement} />
              {!isHidden && <AchievementExtraInfo achievement={achievement} settings={settings} />}
            </div>
            {isHidden && (
              <div className="spoiler-overlay">
                <span>Click to show spoiler</span>
              </div>
            )}
          </div>
          <div className="right">
            <div className="achievement-stats">
              {settings.showPoints && (
                <span className="points">
                  {achievement.points.toLocaleString()}
                  <PointsIcon />
                </span>
              )}

              <Tooltip
                ref={percentageTooltipRef}
                toolTipContent={<TooltipAchievementItem achievement={achievement} sortedBy={settings.sortBy} />}
              >
                <span className={`steam-hunters-percentage ${rarityClass}`}>
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
