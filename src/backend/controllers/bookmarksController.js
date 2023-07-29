// bookmarksController.js
const { collection } = require('../db');

// Save the bookmark URL to the database
async function saveBookmark(req, res) {
  const { realm, character } = req.body;
  const userId = req.user.id; // Assuming you're using authentication and have access to the user ID

  try {
    // Find the user in the database by their user ID
    const user = await collection.findById(userId);

    // Check if the user already has the bookmark in their savedCharacters array
    const isAlreadySaved = user.savedCharacters.some(
      (bookmark) => bookmark.realm === realm && bookmark.character === character
    );

    if (!isAlreadySaved) {
      // Add the new bookmark to the savedCharacters array
      user.savedCharacters.push({ realm, character });
      await user.save();
    }

    res.status(200).json({ message: 'Bookmark saved successfully.' });
  } catch (error) {
    console.error('Error saving bookmark:', error);
    res.status(500).json({ error: 'Failed to save bookmark.' });
  }
}

// Remove the bookmark URL from the database
async function removeBookmark(req, res) {
  const { realm, character } = req.body;
  const userId = req.user.id; // Assuming you're using authentication and have access to the user ID

  try {
    // Find the user in the database by their user ID
    const user = await collection.findById(userId);

    // Filter out the bookmark that matches the provided realm and character
    user.savedCharacters = user.savedCharacters.filter(
      (bookmark) => !(bookmark.realm === realm && bookmark.character === character)
    );

    await user.save();

    res.status(200).json({ message: 'Bookmark removed successfully.' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ error: 'Failed to remove bookmark.' });
  }
}

module.exports = { saveBookmark, removeBookmark };
