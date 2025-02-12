import React from 'react';

interface HeaderProps {
  onGroupingChange: (grouping: string) => void;
  onSortChange: (sort: string) => void;
  onCompareClick: () => void;
  onExpandAllClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGroupingChange,
  onSortChange,
  onCompareClick,
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
        <select onChange={(e) => onSortChange(e.target.value)}>
          <option value="sh">SH%</option>
          {/* Add other sorting options */}
        </select>
        <label>
          <input type="checkbox" onChange={(e) => onSortChange(e.target.checked ? 'reverse' : '')} />
          reverse
        </label>
      </div>
      <div className="right-controls">
        <button onClick={onCompareClick}>Compare</button>
        <button onClick={onExpandAllClick}>Expand All</button>
      </div>
    </div>
  );
};
