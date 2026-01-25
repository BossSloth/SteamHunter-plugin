import { Button, Dropdown, Focusable, SingleDropdownOption, TextField, Toggle } from '@steambrew/client';
import React, { JSX } from 'react';
import { FaGear } from 'react-icons/fa6';
import { useAchievementStore } from '../stores';
import {
  clearAppCache,
  getCacheDate,
} from '../utils/cache';
import { ErrorDisplay } from './ErrorDisplay';
import { Tooltip } from './Tooltip';
import { GroupBy, SortBy } from './types';

interface HeaderProps {
  onCacheCleared(): void;
  onExpandAllClick(): void;
  onPreferencesClick(): void;
  readonly achievementCount: number;
  readonly allGroupsExpanded: boolean;
  readonly appId: string;
}

// eslint-disable-next-line max-lines-per-function
export function Header({
  achievementCount,
  onExpandAllClick,
  allGroupsExpanded,
  onCacheCleared,
  onPreferencesClick,
  appId,
}: HeaderProps): JSX.Element {
  const viewSettings = useAchievementStore();
  const hasCustomDefaults = useAchievementStore(s => s.hasCustomDefaults());

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
            {allGroupsExpanded ? 'Collapse All' : 'Expand All'}
          </Button>

          <Tooltip toolTipContent={<CacheTooltipContent appId={appId} />}>
            <Button
              onClick={() => {
                clearAppCache(appId);
                onCacheCleared();
              }}
            >
              Clear Cache
            </Button>
          </Tooltip>

          <Tooltip
            toolTipContent={
              hasCustomDefaults
                ? <span>Reset saved default settings to standard default values</span>
                : <span>Save current settings as default</span>
            }
          >
            <Button onClick={hasCustomDefaults ? handleResetDefaults : handleDefaultSettings}>
              {hasCustomDefaults ? 'Clear Defaults' : 'Save Defaults'}
            </Button>
          </Tooltip>

          {/* Preferences button placeholder */}
          <Tooltip toolTipContent={<span>Preferences</span>}>
            <Button className="preferences-btn" onClick={onPreferencesClick}>
              <FaGear />
            </Button>
          </Tooltip>
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
