import { Button, Dropdown, Focusable, SingleDropdownOption, TextField, Toggle } from '@steambrew/client';
import React, { JSX, useEffect, useRef } from 'react';
import { FaGear } from 'react-icons/fa6';
import { SteamTooltip } from '../SteamComponents';
import { useAchievementStore } from '../stores';
import {
  clearAppCache,
  getCacheDate,
} from '../utils/cache';
import { ErrorDisplay } from './ErrorDisplay';
import { GroupBy, SortBy } from './types';

interface HeaderProps {
  onCacheCleared(): void;
  onExpandAllClick(): void;
  onPreferencesClick(): void;

  readonly achievementCount: number;
  readonly appId: string;
}

// eslint-disable-next-line max-lines-per-function
export function Header({
  achievementCount,
  onExpandAllClick,
  onCacheCleared,
  onPreferencesClick,
  appId,
}: HeaderProps): JSX.Element {
  const toolTipDom = useRef<HTMLDivElement>(null);
  const fakeMouseOver = new MouseEvent('mouseover', { bubbles: true });
  const fakeMouseOut = new MouseEvent('mouseout', { bubbles: true });

  const viewSettings = useAchievementStore();
  const hasCustomDefaults = useAchievementStore(s => s.hasCustomDefaults());

  useEffect(() => {
    if (!toolTipDom.current) return undefined;

    const currentToolTipDom = toolTipDom.current;

    function onFocus(): void {
      currentToolTipDom.dispatchEvent(fakeMouseOver);
    }

    function onBlur(): void {
      currentToolTipDom.dispatchEvent(fakeMouseOut);
    }

    currentToolTipDom.addEventListener('vgp_onfocus', onFocus);
    currentToolTipDom.addEventListener('vgp_onblur', onBlur);

    return (): void => {
      currentToolTipDom.removeEventListener('vgp_onfocus', onFocus);
      currentToolTipDom.removeEventListener('vgp_onblur', onBlur);
    };
  }, [toolTipDom, fakeMouseOver, fakeMouseOut]);

  function handleDefaultSettings(): void {
    viewSettings.saveAsDefault();
  }

  function handleResetDefaults(): void {
    viewSettings.clearDefaults();
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
            value={viewSettings.searchQuery ?? ''}
            onChange={(e) => { viewSettings.setViewSettings({ searchQuery: e.target.value }); }}
            // @ts-expect-error placeholder does exist
            placeholder="Search achievements..."
          />
        </div>

        <Focusable className="header-actions">
          <Button onClick={onExpandAllClick}>
            {viewSettings.expandAll ? 'Collapse All' : 'Expand All'}
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
            toolTipContent={
              hasCustomDefaults
                ? <span>Reset saved default settings to standard default values</span>
                : <span>Save current settings as default</span>
            }
            nDelayShowMS={100}
            direction="top"
          >
            <Button onClick={hasCustomDefaults ? handleResetDefaults : handleDefaultSettings}>
              {hasCustomDefaults ? 'Clear Defaults' : 'Save Defaults'}
            </Button>
          </SteamTooltip>

          {/* Preferences button placeholder */}
          <SteamTooltip toolTipContent={<span>Preferences</span>} nDelayShowMS={100} direction="top">
            <Button className="preferences-btn" onClick={onPreferencesClick}>
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
                selectedOption={viewSettings.groupBy}
                onChange={(value: SingleDropdownOption) => {
                  viewSettings.setViewSettings({ groupBy: value.data as GroupBy });
                }}
                contextMenuPositionOptions={{ bMatchWidth: false }}
              />
            </div>
          </div>
          <div className="filter-control">
            <span>sorted by</span>
            <div className="dropdown-container" style={{ minWidth: '88px' }}>
              <Dropdown
                rgOptions={Object.values(SortBy).map(option => ({ label: option, data: option }))}
                selectedOption={viewSettings.sortBy}
                onChange={(value: SingleDropdownOption) => {
                  viewSettings.setViewSettings({ sortBy: value.data as SortBy });
                }}
                contextMenuPositionOptions={{ bMatchWidth: false }}
              />
            </div>
          </div>
        </Focusable>

        <Focusable className="toggle-group">
          <div className="toggle-item" onClick={() => { viewSettings.setViewSettings({ reverse: !viewSettings.reverse }); }}>
            <Toggle value={viewSettings.reverse} onChange={(value) => { viewSettings.setViewSettings({ reverse: value }); }} />
            <span>Reverse</span>
          </div>
          <div className="toggle-item" onClick={() => { viewSettings.setViewSettings({ showUnlocked: !viewSettings.showUnlocked }); }}>
            <Toggle value={viewSettings.showUnlocked} onChange={(value) => { viewSettings.setViewSettings({ showUnlocked: value }); }} />
            <span>Show Unlocked</span>
          </div>
        </Focusable>
      </Focusable>
    </Focusable>
  );
}

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
