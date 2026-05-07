const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const HN_URL = 'https://news.ycombinator.com';

exports.scrapeHN = async () => {
  const { data } = await axios.get(HN_URL, { timeout: 15000 });
  const $ = cheerio.load(data);
  const stories = [];

  $('tr.athing').each((_i, el) => {
    if (stories.length >= 10) return;

    const $row = $(el);
    const titleLink = $row.find('.titleline > a');

    const title = titleLink.text().trim();
    const url = titleLink.attr('href');
    const hackerNewsUrl = `https://news.ycombinator.com/item?id=${$row.attr('id')}`;

    const $subtext = $row.next('.athing + tr').find('.subtext');
    const author = $subtext.find('.hnuser').text().trim();
    const points = parseInt($subtext.find('.score').text(), 10) || 0;

    const timeText = $subtext.find('time').attr('datetime');
    const postedAt = timeText ? new Date(timeText) : new Date();

    if (title && url) {
      stories.push({ title, url, points, author, postedAt, hackerNewsUrl });
    }
  });

  return stories;
};

exports.runScraper = async () => {
  const stories = await this.scrapeHN();
  if (!stories.length) {
    console.warn('Scraper: No stories found on HN');
    return { success: false, count: 0 };
  }

  const ops = stories.map((story) => ({
    updateOne: {
      filter: { hackerNewsUrl: story.hackerNewsUrl },
      update: { $set: story },
      upsert: true,
    },
  }));

  const result = await Story.bulkWrite(ops);
  const count = result.upsertedCount + result.modifiedCount;
  console.log(`Scraper: Upserted ${count} stories`);
  return { success: true, count };
};
