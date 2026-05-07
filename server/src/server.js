require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { runScraper } = require('./services/scraperService');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    runScraper().catch((err) => {
      console.error('Initial scraper run failed:', err.message);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
