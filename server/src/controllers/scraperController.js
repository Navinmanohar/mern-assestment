const { runScraper } = require('../services/scraperService');
const AppError = require('../utils/AppError');

exports.triggerScraper = async (req, res, next) => {
  try {
    const result = await runScraper();
    if (!result.success) {
      return next(new AppError('Failed to scrape stories', 500));
    }
    res.json({ success: true, message: `Scraped ${result.count} stories` });
  } catch (error) {
    next(error);
  }
};
