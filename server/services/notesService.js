const getDb = require('../config/db');

exports.getNotes = async (search, tagId) => {
  const db = await getDb();
  let query = `
    SELECT n.* 
    FROM notes n
    LEFT JOIN note_tags nt ON n.id = nt.note_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ' AND (n.title LIKE ? OR n.content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (tagId) {
    query += ' AND nt.tag_id = ?';
    params.push(tagId);
  }

  query += ' GROUP BY n.id ORDER BY n.updated_at DESC';

  const notes = await db.all(query, params);

  // Fetch tags for these notes
  for (let note of notes) {
    const tags = await db.all(
      'SELECT t.id, t.name FROM tags t JOIN note_tags nt ON t.id = nt.tag_id WHERE nt.note_id = ?',
      [note.id]
    );
    note.tags = tags;
  }

  return notes;
};

exports.getNoteById = async (noteId) => {
  const db = await getDb();
  const note = await db.get('SELECT * FROM notes WHERE id = ?', [noteId]);
  if (!note) throw { status: 404, message: 'Note not found' };

  const tags = await db.all(
    'SELECT t.id, t.name FROM tags t JOIN note_tags nt ON t.id = nt.tag_id WHERE nt.note_id = ?',
    [note.id]
  );
  note.tags = tags;

  return note;
};

exports.createNote = async (title, content, tagIds) => {
  if (!title) throw { status: 400, message: 'Title is required' };
  
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO notes (title, content) VALUES (?, ?)',
    [title, content || '']
  );

  const noteId = result.lastID;

  if (tagIds && tagIds.length > 0) {
    for (const tagId of tagIds) {
      await db.run('INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)', [noteId, tagId]);
    }
  }

  return await this.getNoteById(noteId);
};

exports.updateNote = async (noteId, title, content, tagIds) => {
  const db = await getDb();
  const existingNote = await db.get('SELECT * FROM notes WHERE id = ?', [noteId]);
  if (!existingNote) throw { status: 404, message: 'Note not found' };

  const oldContent = existingNote.content;

  if (!title) title = existingNote.title;
  
  await db.run(
    "UPDATE notes SET title = ?, content = ?, updated_at = datetime('now','localtime') WHERE id = ?",
    [title, content !== undefined ? content : oldContent, noteId]
  );

  // Auto-save version history
  if (content !== undefined && oldContent !== content) {
    await db.run(
      'INSERT INTO note_versions (note_id, content) VALUES (?, ?)',
      [noteId, oldContent]
    );
  }

  // Update tags
  if (tagIds !== undefined) {
    await db.run('DELETE FROM note_tags WHERE note_id = ?', [noteId]);
    if (tagIds.length > 0) {
      for (const tagId of tagIds) {
        await db.run('INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)', [noteId, tagId]);
      }
    }
  }

  return await this.getNoteById(noteId);
};

exports.deleteNote = async (noteId) => {
  const db = await getDb();
  const result = await db.run('DELETE FROM notes WHERE id = ?', [noteId]);
  if (result.changes === 0) throw { status: 404, message: 'Note not found' };
  return true;
};

exports.getNoteVersions = async (noteId) => {
  const db = await getDb();
  const note = await db.get('SELECT id FROM notes WHERE id = ?', [noteId]);
  if (!note) throw { status: 404, message: 'Note not found' };

  const versions = await db.all('SELECT * FROM note_versions WHERE note_id = ? ORDER BY created_at DESC', [noteId]);
  return versions;
};
