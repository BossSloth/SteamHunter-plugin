import React from 'react';
import { GroupBy, SortBy, AchievementSettings } from './types';
import { Toggle } from '@steambrew/client';

interface HeaderProps {
  settings: AchievementSettings;
  onSettingsChange: (settings: Partial<AchievementSettings>) => void;
  achievementCount: number;
  groupCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onSettingsChange,
  achievementCount,
  groupCount,
}) => {
  return (
    <div className="achievements-header">
      <div className="left-controls">
        <div>
          <span>{achievementCount} achievements grouped by ({groupCount})</span>
          <select 
            value={settings.groupBy} 
            onChange={(e) => onSettingsChange({ groupBy: e.target.value as GroupBy })}
          >
            {Object.values(GroupBy).map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <span>sorted by</span>
          <select 
            value={settings.sortBy}
            onChange={(e) => onSettingsChange({ sortBy: e.target.value as SortBy })}
          >
            {Object.values(SortBy).map(sortBy => (
              <option key={sortBy} value={sortBy}>{sortBy}</option>
            ))}
          </select>
        </div>
        <div className='toggle-container'>
          <div onClick={() => onSettingsChange({ reverse: !settings.reverse })}>
            <Toggle value={settings.reverse} onChange={(value) => onSettingsChange({ reverse: value })} />
            <span>reverse</span>
          </div>
          <div onClick={() => onSettingsChange({ showPoints: !settings.showPoints })}>
            <Toggle value={settings.showPoints} onChange={(value) => onSettingsChange({ showPoints: value })} />
            <span>show points</span>
          </div>
          <div onClick={() => onSettingsChange({ showUnlocked: !settings.showUnlocked })}>
            <Toggle value={settings.showUnlocked} onChange={(value) => onSettingsChange({ showUnlocked: value })} />
            <span>show unlocked</span>
          </div>
        </div>
      </div>
      <div className="right-controls">
        <button onClick={() => onSettingsChange({ expandAll: !settings.expandAll })}>
          {settings.expandAll ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
    </div>
  );
};
