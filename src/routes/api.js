const express = require('express');
const router = express.Router();
const scraper = require('../services/scraper');

router.get('/', async (req, res) => {
  try {
    const data = await scraper.getHomePage();
    res.json({ success: true, message: 'Data Found!!', results: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { s, page } = req.query;
    if (!s) return res.status(400).json({ success: false, message: 'Search query "s" is required' });
    const data = await scraper.search(s, parseInt(page) || 1);
    res.json({ success: true, message: 'Data Found!!', results: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/info', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, message: 'Anime id is required' });
    const data = await scraper.getAnimeInfo(id);
    res.json({ success: true, cached: false, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/episodes', async (req, res) => {
  try {
    const { id, season } = req.query;
    if (!id) return res.status(400).json({ success: false, message: 'Anime id is required' });
    const data = await scraper.getEpisodes(id, parseInt(season) || 1);
    res.json({ success: true, message: 'Data scraped!!', results: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/stream', async (req, res) => {
  try {
    const { id, season, ep } = req.query;
    if (!id) return res.status(400).json({ success: false, message: 'Anime id is required' });

    if (season && ep) {
      const data = await scraper.getStreamLinks(id, parseInt(season), parseInt(ep));
      res.json({ success: true, message: 'Data Found!!', results: data });
    } else {
      const info = await scraper.getAnimeInfo(id);
      if (info.type === 'Movie') {
        const data = await scraper.getStreamLinks(id);
        res.json({ success: true, message: 'Data Found!!', results: data });
      } else {
        res.status(400).json({ success: false, message: 'Season and ep parameters are required for series' });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/newadded', async (req, res) => {
  try {
    const data = await scraper.getRecentlyAdded();
    res.json({ success: true, message: 'Data Found!!', results: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/series', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await scraper.getSeriesList(page);
    res.json({ success: true, message: 'Data Found!!', results: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/movies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await scraper.getMoviesList(page);
    res.json({ success: true, message: 'Data Found!!', results: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/movie', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, message: 'Movie id is required' });
    const data = await scraper.getMovieInfo(id);
    res.json({ success: true, message: 'data found', results: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
