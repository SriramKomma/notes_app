import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function TagManager({ selectedTags, onTagsChange }) {
  const [availableTags, setAvailableTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await api.get('/tags');
      setAvailableTags(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      const res = await api.post('/tags', { name: newTagName });
      const createdTag = res.data;
      setAvailableTags([...availableTags.filter(t => t.id !== createdTag.id), createdTag]);
      onTagsChange([...selectedTags, createdTag]);
      setNewTagName('');
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTagSelection = (tag) => {
    const isSelected = selectedTags.find(t => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="tag-manager" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {selectedTags.map(tag => (
          <span key={tag.id} className="tag-badge" style={{ backgroundColor: 'var(--primary-color)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>
            {tag.name}
            <button onClick={() => toggleTagSelection(tag)} style={{ background: 'none', border: 'none', color: '#fff', marginLeft: '0.3rem', cursor: 'pointer' }}>×</button>
          </span>
        ))}
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
        >
          + Add Tag
        </button>
      </div>

      {isAdding && (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', width: '250px', zIndex: 10, boxShadow: 'var(--shadow-md)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Select or create tag</h4>
          
          <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {availableTags.map(tag => (
              <div 
                key={tag.id} 
                onClick={() => toggleTagSelection(tag)}
                style={{ padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', background: selectedTags.find(t => t.id === tag.id) ? 'var(--primary-color)' : 'transparent', color: selectedTags.find(t => t.id === tag.id) ? '#fff' : 'var(--text-primary)' }}
              >
                # {tag.name}
              </div>
            ))}
          </div>

          <form onSubmit={handleCreateTag} style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="New tag..." 
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              style={{ flex: 1, padding: '0.3rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'transparent', color: 'var(--text-primary)' }}
            />
            <button type="submit" style={{ padding: '0.3rem 0.6rem', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TagManager;
