import React from 'react';
import { GroupBy, SortBy } from './types';
import { Toggle } from '@steambrew/client';

interface HeaderProps {
  onGroupingChange: (grouping: GroupBy) => void;
  onSortChange: (sort: SortBy) => void;
  reverse: boolean;
  onReverseChange: (reverse: boolean) => void;
  onExpandAllClick: () => void;
  showUnlocked: boolean;
  onShowUnlockedChange: (showUnlocked: boolean) => void;
  groupBy: GroupBy;
  achievementCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onGroupingChange,
  onSortChange,
  reverse,
  onReverseChange,
  onExpandAllClick,
  showUnlocked,
  onShowUnlockedChange,
  groupBy,
  achievementCount
}) => {
  return (
    <div className="achievements-header">
      <div className="left-controls">
        <div>
          <span>{achievementCount} achievements grouped by</span>
          <select value={groupBy} onChange={(e) => onGroupingChange(e.target.value as GroupBy)}>
            {Object.values(GroupBy).map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <span>sorted by</span>
          <select onChange={(e) => onSortChange(e.target.value as SortBy)}>
            {Object.values(SortBy).map(sortBy => (
              <option key={sortBy} value={sortBy}>{sortBy}</option>
            ))}
          </select>
        </div>
        <div className='toggle-container'>
          <div onClick={() => onReverseChange(!reverse)}>
            <Toggle value={reverse} onChange={onReverseChange} />
            <span>reverse</span>
          </div>
          <div onClick={() => onShowUnlockedChange(!showUnlocked)}>
            <Toggle value={showUnlocked} onChange={onShowUnlockedChange} />
            <span>show unlocked</span>
          </div>
        </div>
      </div>
      <div className="right-controls">
        <button onClick={onExpandAllClick}>Expand All</button>
      </div>
    </div>
  );
};
