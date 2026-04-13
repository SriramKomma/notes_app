import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';

import TagManager from '../components/Editor/TagManager';
import VersionPanel from '../components/Editor/VersionPanel';
import MarkdownToolbar from '../components/Editor/MarkdownToolbar';

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const debouncedContent = useDebounce(content, 1000);
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedTags = useDebounce(tags, 1000);

  useEffect(() => {
    fetchNote();
  }, [id]);

  useEffect(() => {
    if (!isInitialLoad) {
      autoSave();
    }
  }, [debouncedContent, debouncedTitle, debouncedTags]);

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setTags(res.data.tags || []);
      setIsInitialLoad(false);
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  };

  const autoSave = async () => {
    setSaveStatus('Saving...');
    try {
      const tagIds = debouncedTags.map(t => t.id);
      await api.put(`/notes/${id}`, {
        title: debouncedTitle,
        content: debouncedContent,
        tags: tagIds
      });
      setSaveStatus('Saved');
    } catch (err) {
      console.error(err);
      setSaveStatus('Error saving');
    }
  };

  const fetchVersions = async () => {
    try {
      const res = await api.get(`/notes/${id}/versions`);
      setVersions(res.data);
      setShowVersions(true);
    } catch (err) {
      console.error(err);
    }
  };

  const restoreVersion = (versionContent) => {
    if (window.confirm('Restore this version? Your current changes will be saved as a new version.')) {
      setContent(versionContent);
      setShowVersions(false);
    }
  };

  const handleInsertMarkdown = (prefix, suffix) => {
    const el = textareaRef.current;
    if (!el) return;
    
    let start = el.selectionStart;
    let end = el.selectionEnd;
    
    const selectedText = content.substring(start, end) || 'text';
    const newContent = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    
    setContent(newContent);
    setSaveStatus('Unsaved changes...');
    
    // Focus back on the textarea and select the text inside the formatting
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const getMarkdownText = () => {
    const rawMarkup = marked(content || '');
    // Allow checkbox inputs through sanitization!
    const cleanMarkup = DOMPurify.sanitize(rawMarkup, { 
      ADD_TAGS: ['input'], 
      ADD_ATTR: ['type', 'checked', 'disabled'] 
    });
    return { __html: cleanMarkup };
  };

  return (
    <div className="editor-layout">
      <header className="editor-header">
        <div className="editor-title-wrap">
          <button className="back-btn" onClick={() => navigate('/')}>←</button>
          <input 
            className="title-input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveStatus('Unsaved changes...');
            }}
            placeholder="Note Title"
          />
        </div>
        
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <TagManager 
            selectedTags={tags} 
            onTagsChange={(newTags) => {
              setTags(newTags);
              setSaveStatus('Unsaved changes...');
            }} 
          />
        </div>

        <div className="editor-actions">
          <span className="save-status">{saveStatus}</span>
          <button className="btn-primary" onClick={fetchVersions}>Versions</button>
        </div>
      </header>
      
      <MarkdownToolbar onInsert={handleInsertMarkdown} />
      
      <div className="split-pane">
        <div className="pane">
          <textarea 
            ref={textareaRef}
            className="textarea-field"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setSaveStatus('Unsaved changes...');
            }}
            placeholder="Start writing in Markdown (e.g. # Heading, **bold**, *italic*)..."
          />
        </div>
        <div 
          className="pane preview-pane"
          dangerouslySetInnerHTML={getMarkdownText()}
        />
      </div>

      <VersionPanel 
        show={showVersions} 
        onClose={() => setShowVersions(false)} 
        versions={versions} 
        onRestore={restoreVersion} 
      />
    </div>
  );
}

export default Editor;
