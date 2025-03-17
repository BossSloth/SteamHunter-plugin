import { Button, Dropdown, Focusable, SingleDropdownOption, TextField, Toggle } from '@steambrew/client';
import React, { useEffect, useRef, useState } from 'react';
import { SteamTooltip } from '../SteamComponents';
import {
  clearAppCache,
  clearDefaultSettings,
  getCacheDate,
  getDefaultSettings,
  saveDefaultSettings,
} from '../utils/cache';
import { ErrorDisplay } from './ErrorDisplay';
import { AchievementSettings, GroupBy, SortBy } from './types';

interface HeaderProps {
  settings: AchievementSettings;
  onSettingsChange: (settings: Partial<AchievementSettings> | null) => void;
  achievementCount: number;
  groupCount: number;
  onExpandAllClick: () => void;
  onCacheCleared?: () => void;
  appId: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onSettingsChange,
  achievementCount,
  groupCount,
  onExpandAllClick,
  onCacheCleared,
  appId,
}) => {
  const toolTipDom = useRef<HTMLDivElement>(null);
  const fakeMouseOver = new MouseEvent('mouseover', { bubbles: true });
  const fakeMouseOut = new MouseEvent('mouseout', { bubbles: true });
  const [hasCustomDefaults, setHasCustomDefaults] = useState(false);

  useEffect(() => {
    if (!toolTipDom.current) return;

    toolTipDom.current.addEventListener('vgp_onfocus', () => {
      toolTipDom.current?.dispatchEvent(fakeMouseOver);
    });
    toolTipDom.current.addEventListener('vgp_onblur', () => {
      toolTipDom.current?.dispatchEvent(fakeMouseOut);
    });
  }, [toolTipDom]);

  useEffect(() => {
    setHasCustomDefaults(!!getDefaultSettings());
  }, []);

  const handleDefaultSettings = () => {
    if (hasCustomDefaults) {
      clearDefaultSettings();
      setHasCustomDefaults(false);
      onSettingsChange(null);
    } else {
      saveDefaultSettings(settings);
      setHasCustomDefaults(true);
    }
  };

  return (
    <Focusable className="achievements-header">
      <div className="css-error">
        <ErrorDisplay errors={[new Error('CSS not injected page will look broken, please report!')]} />
      </div>
      <Focusable className="left-controls">
        <Focusable>
          <span>
            {achievementCount} achievements grouped by ({groupCount})
          </span>
          <div className="dropdown-container" style={{ width: 120 }}>
            <Dropdown
              rgOptions={Object.values(GroupBy).map((group) => ({ label: group, data: group }))}
              selectedOption={settings.groupBy}
              onChange={(data: SingleDropdownOption) => onSettingsChange({ groupBy: data.data })}
              contextMenuPositionOptions={{ bMatchWidth: false }}
            />
          </div>
          <span>sorted by</span>
          <div className="dropdown-container" style={{ width: 90 }}>
            <Dropdown
              rgOptions={Object.values(SortBy).map((sortBy) => ({ label: sortBy, data: sortBy }))}
              selectedOption={settings.sortBy}
              onChange={(data: SingleDropdownOption) => onSettingsChange({ sortBy: data.data })}
              contextMenuPositionOptions={{ bMatchWidth: false }}
            />
          </div>
        </Focusable>
        <Focusable className="toggle-container">
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
        </Focusable>
      </Focusable>
      <Focusable className="right-controls">
        {/* Save defaults */}
        <SteamTooltip
          toolTipContent={
            <span>
              {hasCustomDefaults
                ? 'Reset saved default settings to standard default values'
                : 'Save current settings as default'}
            </span>
          }
          nDelayShowMS={100}
          direction="top"
        >
          <Button onClick={handleDefaultSettings} style={{ width: '126px' }}>
            {hasCustomDefaults ? 'Reset Defaults ' : 'Save as Default'}
          </Button>
        </SteamTooltip>

        {/* Expand all */}
        <Button onClick={onExpandAllClick}>{settings.expandAll ? 'Collapse All' : 'Expand All'}</Button>

        {/* Search */}
        <div className="search-container">
          <TextField
            value={settings.searchQuery || ''}
            onChange={(e) => onSettingsChange({ searchQuery: e.target.value })}
            placeholder="Search achievements..."
          />
        </div>

        {/* Clear cache */}
        <SteamTooltip toolTipContent={<CacheTooltipContent appId={appId} />} nDelayShowMS={100} direction="top">
          <Button
            onClick={() => {
              clearAppCache(appId);
              onCacheCleared?.();
            }}
            ref={toolTipDom}
          >
            Clear cache
          </Button>
        </SteamTooltip>
      </Focusable>
    </Focusable>
  );
};

const CacheTooltipContent: React.FC<{ appId: string }> = ({ appId }) => (
  <span>
    Cache was last updated on
    <br />
    {getCacheDate(appId)?.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) ?? 'never'}
    <br />
    <br />
    Clears the SteamHunters cache for this game.
    <br />
    Use this if achievement data seems outdated or incorrect.
  </span>
);
