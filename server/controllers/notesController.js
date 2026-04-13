const notesService = require('../services/notesService');

exports.getNotes = async (req, res) => {
  const { search, tagId } = req.query;
  try {
    const notes = await notesService.getNotes(search, tagId);
    res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

exports.getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await notesService.getNoteById(id);
    res.status(200).json(note);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

exports.createNote = async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const note = await notesService.createNote(title, content, tags);
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  try {
    const note = await notesService.updateNote(id, title, content, tags);
    res.status(200).json(note);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await notesService.deleteNote(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

exports.getNoteVersions = async (req, res) => {
  const { id } = req.params;
  try {
    const versions = await notesService.getNoteVersions(id);
    res.status(200).json(versions);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};
