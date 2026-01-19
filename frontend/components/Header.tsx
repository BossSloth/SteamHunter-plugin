import { Button, Dropdown, Focusable, SingleDropdownOption, TextField, Toggle } from '@steambrew/client';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { FaGear } from 'react-icons/fa6';
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
  onCacheCleared(): void;
  onExpandAllClick(): void;
  onSettingsChange(settings: Partial<AchievementSettings> | null): void;

  readonly achievementCount: number;
  readonly appId: string;
  readonly settings: AchievementSettings;
}

// eslint-disable-next-line max-lines-per-function
export function Header({
  settings,
  onSettingsChange,
  achievementCount,
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
        <ErrorDisplay errors={[new Error('CSS not injected, page will look broken, please report!')]} />
      </div>

      {/* Top row: Search, actions, preferences */}
      <Focusable className="header-top-row">
        <div className="search-container">
          <TextField
            value={settings.searchQuery ?? ''}
            onChange={(e) => { onSettingsChange({ searchQuery: e.target.value }); }}
            // @ts-expect-error placeholder does exist
            placeholder="Search achievements..."
          />
        </div>

        <Focusable className="header-actions">
          <Button onClick={onExpandAllClick}>
            {settings.expandAll ? 'Collapse All' : 'Expand All'}
          </Button>

          <SteamTooltip toolTipContent={<CacheTooltipContent appId={appId} />} nDelayShowMS={100} direction="top">
            <Button
              onClick={() => {
                clearAppCache(appId);
                onCacheCleared();
              }}
              // @ts-expect-error ref does exist
              ref={toolTipDom}
            >
              Clear Cache
            </Button>
          </SteamTooltip>

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
            <Button onClick={handleDefaultSettings}>
              {hasCustomDefaults ? 'Reset Defaults' : 'Save Defaults'}
            </Button>
          </SteamTooltip>

          {/* Preferences button placeholder */}
          {/* TODO: implement preferences window */}
          <SteamTooltip toolTipContent={<span>Preferences</span>} nDelayShowMS={100} direction="top">
            <Button className="preferences-btn">
              <FaGear />
            </Button>
          </SteamTooltip>
        </Focusable>
      </Focusable>

      {/* Bottom row: Filters and toggles */}
      <Focusable className="header-bottom-row">
        <Focusable className="filter-group">
          <div className="filter-control">
            <span>{achievementCount} achievements grouped by</span>
            <div className="dropdown-container" style={{ minWidth: '125px' }}>
              <Dropdown
                rgOptions={Object.values(GroupBy).map(group => ({ label: group, data: group }))}
                selectedOption={settings.groupBy}
                onChange={(value: SingleDropdownOption) => {
                  onSettingsChange({ groupBy: value.data as GroupBy });
                }}
                contextMenuPositionOptions={{ bMatchWidth: false }}
              />
            </div>
          </div>
          <div className="filter-control">
            <span>sorted by</span>
            <div className="dropdown-container" style={{ minWidth: '88px' }}>
              <Dropdown
                rgOptions={Object.values(SortBy).map(sortBy => ({ label: sortBy, data: sortBy }))}
                selectedOption={settings.sortBy}
                onChange={(value: SingleDropdownOption) => {
                  onSettingsChange({ sortBy: value.data as SortBy });
                }}
                contextMenuPositionOptions={{ bMatchWidth: false }}
              />
            </div>
          </div>
        </Focusable>

        <Focusable className="toggle-group">
          <div className="toggle-item" onClick={() => { onSettingsChange({ reverse: !settings.reverse }); }}>
            <Toggle value={settings.reverse} onChange={(value) => { onSettingsChange({ reverse: value }); }} />
            <span>Reverse</span>
          </div>
          {/* TODO: Move to preferences screen
          <div className="toggle-item" onClick={() => { onSettingsChange({ showPoints: !settings.showPoints }); }}>
            <Toggle value={settings.showPoints} onChange={(value) => { onSettingsChange({ showPoints: value }); }} />
            <span>Show Points</span>
          </div>
          */}
          <div className="toggle-item" onClick={() => { onSettingsChange({ showUnlocked: !settings.showUnlocked }); }}>
            <Toggle value={settings.showUnlocked} onChange={(value) => { onSettingsChange({ showUnlocked: value }); }} />
            <span>Show Unlocked</span>
          </div>
        </Focusable>
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
