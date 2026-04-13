const getDb = require('./server/config/db');
const notesService = require('./server/services/notesService');
(async () => {
  try {
    console.log("Fetching notes...");
    const notes = await notesService.getNotes();
    console.log("Success:", notes);
  } catch(e) {
    console.error("Failure:", e);
  }
})();
