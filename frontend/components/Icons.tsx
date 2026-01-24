import React, { JSX } from 'react';

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

export function GuideIcon(): JSX.Element {
  return (
    <i className="guide-icon" style={{ height: '1em', display: 'flex' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ height: '100%', fill: 'currentColor' }}>
        <path d="M14,10H19.5L14,4.5V10M5,3H15L21,9V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3M5,5V19H19V12H12V5H5M7,14H17V15.5H7V14M7,17H14V18.5H7V17Z" />
      </svg>
    </i>
  );
}

export function UsersIcon(): JSX.Element {
  return (
    <i className="users-icon" style={{ height: '1em', display: 'flex' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ height: '100%', fill: 'currentColor' }}>
        <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15.11 17,16.5V19H22V16.5C22,14.64 19.33,13 16,13M8,13C4.67,13 2,14.64 2,16.5V19H14V16.5C14,14.64 11.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
      </svg>
    </i>
  );
}
