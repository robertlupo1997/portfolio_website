import React from 'react';
import { TIMELINE } from '../constants';

const Timeline: React.FC = () => (
  <div className="timeline">
    {TIMELINE.map((entry) => (
      <div key={entry.year} className={`tl-entry ${entry.current ? 'current' : ''}`}>
        <div className="tl-year">{entry.year}</div>
        <div className="tl-title">{entry.title}</div>
        {entry.sub && <div className="tl-sub">{entry.sub}</div>}
      </div>
    ))}
  </div>
);

export default Timeline;
