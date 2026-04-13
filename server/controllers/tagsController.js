const tagsService = require('../services/tagsService');

exports.getTags = async (req, res) => {
  try {
    const tags = await tagsService.getTags();
    res.status(200).json(tags);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

exports.createTag = async (req, res) => {
  const { name } = req.body;
  try {
    const tag = await tagsService.createTag(name);
    res.status(201).json(tag);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};

exports.deleteTag = async (req, res) => {
  const { id } = req.params;
  try {
    await tagsService.deleteTag(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
};
