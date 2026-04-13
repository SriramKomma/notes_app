import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import NoteCard from '../components/Dashboard/NoteCard';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    fetchNotes();
    fetchTags();
  }, [search, selectedTag]);

  const fetchNotes = async () => {
    try {
      let url = '/notes?';
      if (search) url += `search=${search}&`;
      if (selectedTag) url += `tagId=${selectedTag}&`;
      const res = await api.get(url);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await api.get('/tags');
      setTags(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createNewNote = async () => {
    try {
      const defaultContent = `# Markdown Render Test!\n\n## Headings\n### Heading Level 3\n\nHere is some **bold text** and *italic text*!\n\n### Ordered List\n1. First requirement\n2. Second requirement\n\n### Unordered List\n- React\n- Node.js\n- SQLite\n\n### Inline & Fenced Code\nYou can use \`inline code\` or block:\n\n\`\`\`javascript\nconsole.log("Renderer is fully functional!")\n\`\`\`\n\n### Hyperlinks\nCheck out my [Github](https://github.com)!`;
      const res = await api.post('/notes', { title: 'Untitled Note', content: defaultContent });
      navigate(`/note/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        tags={tags} 
        selectedTag={selectedTag} 
        onSelectTag={setSelectedTag} 
        onCreateNote={createNewNote} 
      />

      <main className="main-content">
        <header className="main-header">
          <h1>{selectedTag ? `Tag: ${tags.find(t => t.id === selectedTag)?.name}` : 'All Notes'}</h1>
          <input 
            type="text" 
            placeholder="Search notes..." 
            className="input-field search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </header>

        <div className="notes-grid">
          {notes.length === 0 ? (
            <div className="empty-state">No notes found. Create one!</div>
          ) : (
            notes.map(note => (
              <NoteCard key={note.id} note={note} onDelete={deleteNote} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
