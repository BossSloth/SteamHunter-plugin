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
  onSettingsChange(settings: Partial<AchievementSettings> | null): void;
  onExpandAllClick(): void;
  onCacheCleared(): void;

  readonly settings: AchievementSettings;
  readonly achievementCount: number;
  readonly groupCount: number;
  readonly appId: string;
}

// eslint-disable-next-line max-lines-per-function
export function Header({
  settings,
  onSettingsChange,
  achievementCount,
  groupCount,
  onExpandAllClick,
  onCacheCleared,
  appId,
}: HeaderProps): JSX.Element {
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
    setHasCustomDefaults(getDefaultSettings() !== null);
  }, []);

  function handleDefaultSettings(): void {
    if (hasCustomDefaults) {
      clearDefaultSettings();
      setHasCustomDefaults(false);
      onSettingsChange(null);
    } else {
      saveDefaultSettings(settings);
      setHasCustomDefaults(true);
    }
  }

  return (
    <Focusable className="achievements-header">
      <div className="css-error">
        <ErrorDisplay errors={[new Error('CSS not injected page will look broken, please report!')]} />
      </div>
      <Focusable className="left-controls">
        <Focusable>
          <span>
            {`${achievementCount} achievements grouped by (${groupCount})`}
          </span>
          <div className="dropdown-container" style={{ width: 120 }}>
            <Dropdown
              rgOptions={Object.values(GroupBy).map(group => ({ label: group, data: group }))}
              selectedOption={settings.groupBy}
              onChange={(value: SingleDropdownOption) => {
                onSettingsChange({ groupBy: value.data as GroupBy });
              }}
              contextMenuPositionOptions={{ bMatchWidth: false }}
            />
          </div>
          <span>sorted by</span>
          <div className="dropdown-container" style={{ width: 90 }}>
            <Dropdown
              rgOptions={Object.values(SortBy).map(sortBy => ({ label: sortBy, data: sortBy }))}
              selectedOption={settings.sortBy}
              onChange={(value: SingleDropdownOption) => {
                onSettingsChange({ sortBy: value.data as SortBy });
              }}
              contextMenuPositionOptions={{ bMatchWidth: false }}
            />
          </div>
        </Focusable>
        <Focusable className="toggle-container">
          <div onClick={() => { onSettingsChange({ reverse: !settings.reverse }); }}>
            <Toggle value={settings.reverse} onChange={(value) => { onSettingsChange({ reverse: value }); }} />
            <span>reverse</span>
          </div>
          <div onClick={() => { onSettingsChange({ showPoints: !settings.showPoints }); }}>
            <Toggle value={settings.showPoints} onChange={(value) => { onSettingsChange({ showPoints: value }); }} />
            <span>show points</span>
          </div>
          <div onClick={() => { onSettingsChange({ showUnlocked: !settings.showUnlocked }); }}>
            <Toggle value={settings.showUnlocked} onChange={(value) => { onSettingsChange({ showUnlocked: value }); }} />
            <span>show unlocked</span>
          </div>
        </Focusable>
      </Focusable>
      <Focusable className="right-controls">
        {/* Save defaults */}
        <SteamTooltip
          toolTipContent={(
            <span>
              {hasCustomDefaults
                ? 'Reset saved default settings to standard default values'
                : 'Save current settings as default'}
            </span>
          )}
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
            value={settings.searchQuery ?? ''}
            onChange={(e) => { onSettingsChange({ searchQuery: e.target.value }); }}
            placeholder="Search achievements..."
          />
        </div>

        {/* Clear cache */}
        <SteamTooltip toolTipContent={<CacheTooltipContent appId={appId} />} nDelayShowMS={100} direction="top">
          <Button
            onClick={() => {
              clearAppCache(appId);
              onCacheCleared();
            }}
            ref={toolTipDom}
          >
            Clear cache
          </Button>
        </SteamTooltip>
      </Focusable>
    </Focusable>
  );
}

// eslint-disable-next-line react/no-multi-comp
function CacheTooltipContent({ appId }: { readonly appId: string; }): JSX.Element {
  return (
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
}
