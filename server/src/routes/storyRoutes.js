const express = require('express');
const { getStories, getStoryById, toggleBookmark, getBookmarks } = require('../controllers/storyController');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/', getStories);
router.get('/:id', getStoryById);
router.post('/:id/bookmark', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarks);

module.exports = router;
