import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

function Sidebar({ tags, selectedTag, onSelectTag, onCreateNote }) {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>NotesApp</h2>
      </div>
      
      <button className="btn-primary new-note-btn" onClick={onCreateNote}>
        + New Note
      </button>

      <div className="nav-section">
        <h3>Tags Filter</h3>
        <ul className="tag-list">
          <li 
            className={!selectedTag ? 'active' : ''} 
            onClick={() => onSelectTag(null)}
          >
            All Notes
          </li>
          {tags.map(tag => (
            <li 
              key={tag.id} 
              className={selectedTag === tag.id ? 'active' : ''}
              onClick={() => onSelectTag(tag.id)}
            >
              # {tag.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
