import React from 'react';
import { SortBy } from './AchievementPage';
import { Toggle } from '@steambrew/client';

interface HeaderProps {
  onGroupingChange: (grouping: string) => void;
  onSortChange: (sort: SortBy) => void;
  reverse: boolean;
  onReverseChange: (reverse: boolean) => void;
  onExpandAllClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGroupingChange,
  onSortChange,
  reverse,
  onReverseChange,
  onExpandAllClick,
}) => {
  return (
    <div className="achievements-header">
      <div className="left-controls">
        <span>{39} achievements grouped by</span>
        <select onChange={(e) => onGroupingChange(e.target.value)}>
          <option value="dlc_update">DLC & update</option>
          {/* Add other grouping options */}
        </select>
        <span>sorted by</span>
        <select onChange={(e) => onSortChange(e.target.value as SortBy)}>
          {Object.values(SortBy).map(sortBy => (
            <option key={sortBy} value={sortBy}>{sortBy}</option>
          ))}
        </select>
        <div className='reverse-toggle'>
          <Toggle value={reverse} onChange={onReverseChange} />
          reverse
        </div>
      </div>
      <div className="right-controls">
        <button onClick={onExpandAllClick}>Expand All</button>
      </div>
    </div>
  );
};
