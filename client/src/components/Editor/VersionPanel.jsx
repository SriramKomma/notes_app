import React from 'react';

function VersionPanel({ show, onClose, versions, onRestore }) {
  return (
    <div className={`versions-panel ${show ? 'open' : ''}`}>
      <div className="versions-header">
        <h3>Version History</h3>
        <button className="back-btn" onClick={onClose}>✕</button>
      </div>
      <div className="versions-list">
        {versions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No previous versions found.</p>
        ) : (
          versions.map(v => (
            <div key={v.id} className="version-item" onClick={() => onRestore(v.content)}>
              <div style={{ fontWeight: 'bold' }}>{new Date(v.created_at).toLocaleString()}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {v.content.substring(0, 50)}...
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VersionPanel;
