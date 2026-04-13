import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();

  return (
    <div 
      className="note-card"
      onClick={() => navigate(`/note/${note.id}`)}
    >
      <div className="note-card-header">
        <h3>{note.title || 'Untitled'}</h3>
        <button 
          className="delete-btn" 
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Delete this note?')) {
              onDelete(note.id);
            }
          }}
        >
          ✕
        </button>
      </div>
      <p className="note-excerpt">
        {note.content ? note.content.substring(0, 100) + '...' : 'Empty note...'}
      </p>
      <div className="note-meta">
        <span>{new Date(note.updated_at).toLocaleDateString()}</span>
        <div className="note-tags">
          {note.tags && note.tags.map(t => (
            <span key={t.id} className="tag-badge">{t.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
