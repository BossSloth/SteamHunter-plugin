import { Button, Focusable, Toggle } from '@steambrew/client';
import { initHltbInjection } from 'hltb/HltbInjection';
import React, { JSX, useMemo } from 'react';
import { ControllerFocusable } from 'SteamComponents';
import { useAchievementStore } from '../stores';
import { AchievementGroup } from './AchievementGroup';
import { ProcessedGroup } from './AchievementPage';
import { AchievementData, Obtainability } from './types';

interface PreferencesPopupProps {
  onClose(): void;
  readonly processedGroup: ProcessedGroup;
}

const PREVIEW_ACHIEVEMENT: AchievementData = {
  achievementId: 2,
  apiName: 'preview_achievement',
  name: 'Preview Achievement',
  description: 'This is a preview of how an achievement with everything will look with your current preferences.',
  points: 60,
  localPercentage: 46.5,
  steamPercentage: 24.0,
  steamPoints: 10,
  strImage: 'https://community.cloudflare.steamstatic.com/public/images/apps/570/7735399589d813735f448e89f6680a656a81180b.jpg',
  unlocked: true,
  obtainability: Obtainability.ConditionallyObtainable,
  completedCount: 8123,
  totalPlayers: 10000,
  tags: { Grind: 5 },
  isHidden: false,
  guideUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

const SECOND_PREVIEW_ACHIEVEMENT: AchievementData = {
  achievementId: 1,
  apiName: 'second_preview_achievement',
  name: 'Another Preview Achievement',
  description: 'This is a preview of how an achievement with everything will look with your current preferences. This achievement is hidden and has an extra long description that should wrap to multiple lines.',
  points: 100,
  localPercentage: 12.5,
  steamPercentage: 11.0,
  steamPoints: 10,
  strImage: 'https://community.cloudflare.steamstatic.com/public/images/apps/570/7735399589d813735f448e89f6680a656a81180b.jpg',
  unlocked: false,
  obtainability: Obtainability.Unobtainable,
  completedCount: 1234,
  totalPlayers: 10000,
  tags: { Skill: 15, Grind: 5 },
  isHidden: true,
  guideUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

const PREVIEW_GROUP = {
  achievementApiNames: ['preview_achievement'],
  name: 'Preview Group',
};

const PREVIEW_GAME_INFO = {
  appId: 12345,
  name: 'Preview Game',
  playersQualifiedCount: 10000,
  releaseDate: '2024-01-01',
};

interface PreferenceItemProps {
  onChange(value: boolean): void;
  readonly description: string;
  readonly label: string;
  readonly value: boolean;
}

function PreferenceItem({ description, label, onChange, value }: PreferenceItemProps): JSX.Element {
  return (
    <ControllerFocusable className="preference-item" onClick={() => { onChange(!value); }}>
      <div className="preference-info">
        <div className="preference-label">{label}</div>
        <div className="preference-description">{description}</div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </ControllerFocusable>
  );
}

export function PreferencesPopup({ onClose, processedGroup }: PreferencesPopupProps): JSX.Element {
  const setPreferences = useAchievementStore(s => s.setPreferences);

  const settings = useAchievementStore();

  const achievements: AchievementData[] = useMemo(() => {
    const images = processedGroup.groupAchievements.map(achievement => achievement.strImage);

    function getRandomImage(): string {
      return images[Math.floor(Math.random() * images.length)] ?? '';
    }

    return [
      { ...PREVIEW_ACHIEVEMENT, strImage: getRandomImage() },
      { ...SECOND_PREVIEW_ACHIEVEMENT, strImage: getRandomImage() },
    ];
  }, [processedGroup.group.name]);

  return (
    <Focusable className="preferences-overlay" onClick={onClose}>
      <Focusable className="preferences-popup" onClick={(e) => { e.stopPropagation(); }}>
        <div className="preferences-header">
          <h2>Preferences</h2>
          <Button onClick={onClose}>Close</Button>
        </div>

        <div className="preferences-list">
          <PreferenceItem
            label="Show points"
            description="Display the point value for each achievement and group."
            value={settings.showPoints}
            onChange={(val) => { setPreferences({ showPoints: val }); }}
          />
          <PreferenceItem
            label="Show tags"
            description="Display community tags (e.g., 'Skill', 'Grind') for achievements."
            value={settings.showTags}
            onChange={(val) => { setPreferences({ showTags: val }); }}
          />
          <PreferenceItem
            label="Show obtainability"
            description="Show if an achievement is broken, conditionally obtainable, or unobtainable."
            value={settings.showObtainability}
            onChange={(val) => { setPreferences({ showObtainability: val }); }}
          />
          <PreferenceItem
            label="Show playercount"
            description="Display the number of players who have unlocked the achievement."
            value={settings.showPlayerCount}
            onChange={(val) => { setPreferences({ showPlayerCount: val }); }}
          />
          <PreferenceItem
            label="Show guides"
            description="Display guide links for achievements that have available guides."
            value={settings.showGuides}
            onChange={(val) => { setPreferences({ showGuides: val }); }}
          />
          <PreferenceItem
            label="Hide hidden achievements"
            description="Hides the name and description of hidden achievements until clicked (like Steam's spoiler protection)."
            value={settings.hideHidden}
            onChange={(val) => { setPreferences({ hideHidden: val }); }}
          />

          <hr />

          <PreferenceItem
            label="Show HLTB data"
            description="HLTB data has temporarily been added to this plugin. This toggles if it will be displayed in the game details section. It has nothing to do with the achievements."
            value={settings.showHltb}
            onChange={(val) => {
              setPreferences({ showHltb: val });
              if (val) {
                initHltbInjection();
              }
            }}
          />

          <PreferenceItem
            label="Show playercount in game details"
            description="HLTB playercount data has temporarily been added to this plugin. This toggles if it will be displayed in the game details section. It has nothing to do with the achievements."
            value={settings.showHltbPlayerCount}
            onChange={(val) => {
              setPreferences({ showHltbPlayerCount: val });
              if (val) {
                initHltbInjection();
              }
            }}
          />
        </div>

        <div className="preferences-preview">
          <h3 className="preview-text">Preview</h3>
          <div className="preview-window">
            <AchievementGroup
              groupInfo={processedGroup.group}
              title={PREVIEW_GROUP.name}
              achievements={achievements}
              totalPoints={achievements.reduce((acc, achievement) => acc + achievement.points, 0)}
              isExpanded
              gameInfo={PREVIEW_GAME_INFO}
              onExpandChange={(): void => { /* empty */ }}
            />
          </div>
        </div>
      </Focusable>
    </Focusable>
  );
}
