import React from 'react';
import { CREDENTIALS } from '../constants';

const CredentialStrip: React.FC = () => {
  const items = [...CREDENTIALS, ...CREDENTIALS];

  return (
    <div className="credential-strip" aria-label="Credentials">
      <div className="credential-track">
        {items.map((cred, i) => (
          <React.Fragment key={i}>
            <span className="credential-item">{cred.label}</span>
            <span className="credential-sep" aria-hidden="true">·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CredentialStrip;
