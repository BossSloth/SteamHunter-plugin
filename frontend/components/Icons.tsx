/* eslint-disable react/no-multi-comp */
import React from 'react';

export function PointsIcon(): JSX.Element {
  return (
    <i className="points-icon" style={{ height: '0.8em', display: 'flex' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ height: '100%' }}>
        <path d="M16.23,18L12,15.45L7.77,18L8.89,13.19L5.16,9.96L10.08,9.54L12,5L13.92,9.53L18.84,9.95L15.11,13.18L16.23,18M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
      </svg>
    </i>
  );
}

export function AchievementIcon(): JSX.Element {
  return (
    <i className="achievement-icon" style={{ height: '25px', display: 'flex' }}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="_1uKlfc1_Z49lxRNSctgO7y" viewBox="0 0 36 36"><path fill="url(#b)" stroke="url(#a)" strokeWidth="1.5" d="m10.178 10.026.215-.22V5.529H14.6l.22-.224L18 2.07l3.18 3.234.22.224h4.207v4.279l.215.219 2.733 2.78-2.733 2.78-.215.218v4.279H21.4l-.22.225L18 23.54l-3.18-3.233-.22-.225h-4.207v-4.279l-.215-.219-2.733-2.78 2.733-2.78Zm4.562 18.006-3.18 5.39-1.708-3.475-.206-.42H6.295l2.39-4.166h3.43l2.625 2.67Zm12.081 1.496h-.467l-.206.419-1.708 3.475-3.18-5.39 2.626-2.67h3.43l2.39 4.166H26.82Z" /><circle cx="18" cy="13" r="5.5" fill="#FFC82C" stroke="#FFAB2C" /><defs><linearGradient id="b" x1="7.08" x2="33.669" y1="3.72" y2="25.07" gradientUnits="userSpaceOnUse"><stop stopColor="#0056D6" /><stop offset="1" stopColor="#1A9FFF" /></linearGradient><linearGradient id="a" x1="7.08" x2="33.669" y1="3.72" y2="25.07" gradientUnits="userSpaceOnUse"><stop stopColor="#0056D6" /><stop offset="1" stopColor="#1A9FFF" /></linearGradient></defs></svg>
    </i>
  );
}
