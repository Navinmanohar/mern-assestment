const Story = require('../models/Story');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getStories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      Story.find().sort({ postedAt: -1 }).skip(skip).limit(limit),
      Story.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        stories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return next(new AppError('Story not found', 404));
    }

    res.json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
};

exports.toggleBookmark = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return next(new AppError('Story not found', 404));
    }

    const user = await User.findById(req.userId);
    const index = user.bookmarks.indexOf(story._id);

    if (index > -1) {
      user.bookmarks.splice(index, 1);
    } else {
      user.bookmarks.push(story._id);
    }

    await user.save();

    res.json({
      success: true,
      data: { bookmarked: index === -1, bookmarks: user.bookmarks },
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'bookmarks',
      options: { sort: { postedAt: -1 } },
    });

    res.json({ success: true, data: user.bookmarks });
  } catch (error) {
    next(error);
  }
};
