import React, { useEffect, useRef } from 'react';
import { GroupBy, SortBy, AchievementSettings } from './types';
import { Toggle, TextField, Focusable, Dropdown, Button } from '@steambrew/client';
import { SteamTooltip } from '../SteamComponents';
import { clearAppCache, getCacheDate } from '../utils/cache';
import { ErrorDisplay } from './ErrorDisplay';

interface HeaderProps {
  settings: AchievementSettings;
  onSettingsChange: (settings: Partial<AchievementSettings>) => void;
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
  const toolTipDom = useRef<HTMLSpanElement>(null);
  const fakeMouseOver = new MouseEvent('mouseover', {bubbles: true});
  const fakeMouseOut = new MouseEvent('mouseout', {bubbles: true});

  useEffect(() => {
    toolTipDom.current.addEventListener('vgp_onfocus', () => {toolTipDom.current?.dispatchEvent(fakeMouseOver)});
    toolTipDom.current.addEventListener('vgp_onblur', () => {toolTipDom.current?.dispatchEvent(fakeMouseOut)});
  }, [toolTipDom]);

  return (
    <Focusable className="achievements-header">
      <div className='css-error'><ErrorDisplay errors={[new Error('CSS not injected page will look broken, please report!')]} /></div>
      <Focusable className="left-controls">
        <Focusable>
          <span>{achievementCount} achievements grouped by ({groupCount})</span>
          <Dropdown 
            rgOptions={Object.values(GroupBy).map(group => ({ label: group, data: group }))}
            selectedOption={settings.groupBy}
            onChange={(data: any) => onSettingsChange({ groupBy: data.data })}
            contextMenuPositionOptions={{bMatchWidth: false}}
          />
          <span>sorted by</span>
          <div style={{width: 90}}>
            <Dropdown 
              rgOptions={Object.values(SortBy).map(sortBy => ({ label: sortBy, data: sortBy }))}
              selectedOption={settings.sortBy}
              onChange={(data: any) => onSettingsChange({ sortBy: data.data })}
              contextMenuPositionOptions={{bMatchWidth: false}}
            />
          </div>
        </Focusable>
        <Focusable className='toggle-container'>
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
          <div className='search-container'>
            <TextField
              value={settings.searchQuery || ''}
              onChange={(e) => onSettingsChange({ searchQuery: e.target.value })}
              placeholder="Search achievements..."
            />
          </div>
        </Focusable>
      </Focusable>
      <Focusable className="right-controls">
        <Button onClick={onExpandAllClick}>
          {settings.expandAll ? 'Collapse All' : 'Expand All'}
        </Button>
        <SteamTooltip toolTipContent={
          <span>
            Cache was last updated on<br/>{getCacheDate(appId)?.toLocaleString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true}) ?? 'never'}
            <br/><br/>
            Clears the SteamHunters cache for this game.
            <br/>
            Use this if achievement data seems outdated or incorrect.
          </span>
        } nDelayShowMS={100} direction='top'>
          <Button 
            onClick={() => {
              clearAppCache(appId);
              onCacheCleared?.();
            }} 
            // @ts-ignore
            ref={toolTipDom}
          >
            Clear cache
          </Button>
        </SteamTooltip>
      </Focusable>
    </Focusable>
  );
};
