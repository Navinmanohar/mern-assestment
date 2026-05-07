const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  author: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    required: true,
  },
  hackerNewsUrl: {
    type: String,
    required: true,
  },
}, { timestamps: true });

storySchema.index({ hackerNewsUrl: 1 }, { unique: true });
storySchema.index({ postedAt: -1 });

module.exports = mongoose.model('Story', storySchema);
