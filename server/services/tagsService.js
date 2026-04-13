const getDb = require('../config/db');

exports.getTags = async () => {
  const db = await getDb();
  const tags = await db.all('SELECT * FROM tags ORDER BY name ASC');
  return tags;
};

exports.createTag = async (name) => {
  if (!name || name.trim() === '') {
    throw { status: 400, message: 'Tag name is required' };
  }

  const trimmedName = name.trim();
  const db = await getDb();

  // Check existing
  const existing = await db.get('SELECT * FROM tags WHERE name = ?', [trimmedName]);
  if (existing) {
    return existing; // Return existing tag silently
  }

  const result = await db.run('INSERT INTO tags (name) VALUES (?)', [trimmedName]);
  return { id: result.lastID, name: trimmedName };
};

exports.deleteTag = async (tagId) => {
  const db = await getDb();
  const result = await db.run('DELETE FROM tags WHERE id = ?', [tagId]);
  if (result.changes === 0) throw { status: 404, message: 'Tag not found' };
  return true;
};
