import React from 'react';

function MarkdownToolbar({ onInsert }) {
  const handleInsert = (e, prefix, suffix) => {
    e.preventDefault(); // Prevent focus loss from textarea
    onInsert(prefix, suffix);
  };

  return (
    <div className="markdown-toolbar">
      <div className="toolbar-group">
        <button onMouseDown={(e) => handleInsert(e, '# ', '')} title="Heading 1">H1</button>
        <button onMouseDown={(e) => handleInsert(e, '## ', '')} title="Heading 2">H2</button>
        <button onMouseDown={(e) => handleInsert(e, '### ', '')} title="Heading 3">H3</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button onMouseDown={(e) => handleInsert(e, '**', '**')} title="Bold"><b>B</b></button>
        <button onMouseDown={(e) => handleInsert(e, '*', '*')} title="Italic"><i>I</i></button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button onMouseDown={(e) => handleInsert(e, '- ', '')} title="Unordered List">• List</button>
        <button onMouseDown={(e) => handleInsert(e, '1. ', '')} title="Ordered List">1. List</button>
        <button onMouseDown={(e) => handleInsert(e, '- [ ] ', '')} title="Checkbox">☑ Task</button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <button onMouseDown={(e) => handleInsert(e, '`', '`')} title="Inline Code">&lt;/&gt;</button>
        <button onMouseDown={(e) => handleInsert(e, '\n```javascript\n', '\n```\n')} title="Code Block">Block</button>
        <button onMouseDown={(e) => handleInsert(e, '[', '](https://)')} title="Hyperlink">🔗</button>
      </div>
    </div>
  );
}

export default MarkdownToolbar;
