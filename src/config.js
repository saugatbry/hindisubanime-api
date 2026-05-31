require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT || '3000'),
  mainUrl: process.env.MAIN_URL || 'https://hindisubanime.co',
  cacheTtl: parseInt(process.env.CACHE_TTL || '300'),
  rateLimit: {
    window: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  supportedTypes: ['Cartoon', 'Anime', 'AnimeMovie', 'Movie'],
};
