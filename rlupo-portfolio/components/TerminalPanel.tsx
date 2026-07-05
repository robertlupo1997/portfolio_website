import React from 'react';
import { Project } from '../types';
import TextScramble from './TextScramble';

interface TerminalPanelProps {
  project: Project;
  index: number;
  isActive: boolean;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ project, index, isActive }) => {
  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-index">P/{String(index + 1).padStart(2, '0')}</span>
        <span className="terminal-epoch">{project.epoch}</span>
      </div>

      <div className={`terminal-body ${isActive ? 'terminal-body--active' : ''}`}>
        <div className="terminal-line terminal-prompt">
          $ cat {project.id} --verbose
        </div>

        <div className="terminal-line">
          <span className="terminal-label">TITLE:</span>
          <span className="terminal-value">
            {isActive ? (
              <TextScramble text={project.title} triggerOnView={false} triggerOnHover={false} duration={600} delay={0} />
            ) : project.title}
          </span>
        </div>

        <div className="terminal-line">
          <span className="terminal-label">CLASS:</span>
          <span className="terminal-value">{project.category}</span>
        </div>

        <div className="terminal-line">
          <span className="terminal-label">STATUS:</span>
          <span className="terminal-value">{project.featured ? 'production' : 'active'}</span>
        </div>

        <div className="terminal-line">
          <span className="terminal-label">METRIC:</span>
          <span className="terminal-value">{project.metric} {project.metricLabel}</span>
        </div>

        <div className="terminal-line terminal-description">
          <span className="terminal-caret">&gt; </span>
          {project.description}
        </div>

        <div className="terminal-line">
          <span className="terminal-label">STACK:</span>
          <span className="terminal-value">{project.stack.join(' / ')}</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalPanel;
