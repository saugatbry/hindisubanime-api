const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config');
const cache = require('../utils/cache');

const client = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': config.userAgent,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  },
});

function extractAnimeId(url) {
  const path = new URL(url, config.mainUrl).pathname.replace(/\/$/, '');
  return path.split('/').filter(Boolean).pop() || null;
}

function fixUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return `${config.mainUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

const mainPageCategories = [
  { path: '/category/shounen/', name: 'Shounen' },
  { path: '/category/action/', name: 'Action' },
  { path: '/category/fantasy/', name: 'Fantasy' },
  { path: '/serie/', name: 'Series' },
];

async function fetchPage(url) {
  const response = await client.get(url);
  return cheerio.load(response.data);
}

function parseArticleCard($, element) {
  const $el = $(element);
  const href = $el.find('a.lnk-blk').attr('href');
  if (!href) return null;

  let posterUrl = $el.find('div figure img').attr('src');
  if (!posterUrl || posterUrl.includes('data:image')) {
    posterUrl = $el.find('div figure img').attr('data-lazy-src');
  }

  const title = $el.find('header h2').text().trim() || 'Unknown';

  return {
    title,
    anime_id: extractAnimeId(href),
    poster: fixUrl(posterUrl),
    url: fixUrl(href),
  };
}

async function getHomePage() {
  const cacheKey = 'homepage';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const results = {};
  for (const cat of mainPageCategories) {
    const $ = await fetchPage(`${config.mainUrl}${cat.path}`);
    const items = [];
    $('article').each((_, el) => {
      const parsed = parseArticleCard($, el);
      if (parsed) items.push(parsed);
    });
    results[cat.name] = items;
  }

  cache.set(cacheKey, results);
  return results;
}

async function search(query, page = 1) {
  const cacheKey = `search:${query}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const $ = await fetchPage(`${config.mainUrl}/page/${page}/?s=${encodeURIComponent(query)}`);

  const results = [];
  $('ul[data-results] li article').each((_, el) => {
    const parsed = parseArticleCard($, el);
    if (parsed) results.push(parsed);
  });

  const totalPages = (() => {
    const pagination = $('a.page-numbers');
    const nums = [];
    pagination.each((_, el) => {
      const n = parseInt($(el).text().trim());
      if (!isNaN(n)) nums.push(n);
    });
    return nums.length > 0 ? Math.max(...nums) : 1;
  })();

  const output = { currentPage: page, totalPages, results };
  cache.set(cacheKey, output);
  return output;
}

async function getAnimeInfo(animeId) {
  const url = fixUrl(`/anime/${animeId}/`);
  const $ = await fetchPage(url);

  const title =
    $('h1.entry-title')
      .text()
      .trim()
      .replace(/^Watch Online\s*/i, '')
      .replace(/\s*Movie in Hindi Dubbed Free\s*$/i, '') ||
    $('meta[property=og:title]').attr('content')?.replace(/^Watch Online\s*/i, '').replace(/\s*Movie in Hindi Dubbed Free\s*$/i, '') ||
    'No Title';

  const poster = fixUrl(
    $('div.post-thumbnail figure img').attr('src') || $('meta[property=og:image]').attr('content')
  );

  const overview =
    $('div.entry-content p').first().text().trim() ||
    $('meta[name=twitter:description]').attr('content') ||
    '';

  const year = (() => {
    const yearText = $('span.year').text().trim() || $('meta[property=og:updated_time]').attr('content');
    if (yearText) {
      const match = yearText.match(/\d{4}/);
      return match ? match[0] : null;
    }
    return null;
  })();

  const seasonEpLinks = [];
  $('ul.seasons-lst li').each((_, el) => {
    const $li = $(el);
    const name = $li.find('h3.title').clone().children().remove().end().text().trim() || null;
    const href = $li.find('a').attr('href');
    const epPoster = $li.find('div > div > figure > img').attr('src');
    const spanText = $li.find('h3.title > span').text();
    const seasonMatch = spanText.match(/S(\d+)/i);
    const season = seasonMatch ? parseInt(seasonMatch[1]) : null;

    let episode = null;
    const epMatch = spanText.match(/(?:E|Ep|Episode)\s*(\d+)/i);
    if (epMatch) {
      episode = parseInt(epMatch[1]);
    } else if (href) {
      const urlEpMatch = href.match(/[_-](\d+)x(\d+)/i);
      if (urlEpMatch) episode = parseInt(urlEpMatch[2]);
    }

    if (href) {
      seasonEpLinks.push({
        title: name,
        season,
        episode,
        episode_url: fixUrl(href),
        poster: fixUrl(epPoster),
      });
    }
  });

  const isMovie = seasonEpLinks.length === 0;

  const genres = [];
  $('a[rel="tag"]').each((_, el) => {
    const tag = $(el).text().trim();
    if (tag) genres.push(tag);
  });

  return {
    title,
    anime_id: animeId,
    poster,
    overview,
    year,
    genres: [...new Set(genres)],
    totalSeasons: isMovie ? null : [...new Set(seasonEpLinks.map((e) => e.season).filter(Boolean))].length,
    totalEpisodes: isMovie ? null : seasonEpLinks.length,
    type: isMovie ? 'Movie' : 'Series',
    episodes: isMovie ? null : seasonEpLinks,
    stream: isMovie
      ? null
      : null,
  };
}

async function getEpisodes(animeId, season = 1) {
  const info = await getAnimeInfo(animeId);
  if (info.type === 'Movie') {
    return { totalEpisodes: 0, episodes: [] };
  }

  const filtered = info.episodes.filter((e) => e.season === parseInt(season));
  return {
    totalEpisodes: filtered.length,
    episodes: filtered.map((e) => ({
      title: e.title,
      season: e.season,
      episode: e.episode,
      poster: e.poster,
      episode_url: e.episode_url,
    })),
  };
}

async function getStreamLinks(animeId, season = 1, episode = 1) {
  const info = await getAnimeInfo(animeId);
  if (info.type === 'Movie') {
    return await getMovieStreams(info);
  }

  const epData = info.episodes?.find((e) => e.season === parseInt(season));
  if (!epData) throw new Error(`Season ${season} not found`);

  const episodeUrl = epData.episode_url;
  return await extractIframeLinks(episodeUrl);
}

async function getMovieStreams(info) {
  if (info.stream) return info.stream;

  const url = fixUrl(`/anime/${info.anime_id}/`);
  return await extractIframeLinks(url);
}

async function extractIframeLinks(pageUrl) {
  const cacheKey = `stream:${pageUrl}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const $ = await fetchPage(pageUrl);
  const bodyClass = $('body').attr('class') || '';
  const termMatch = bodyClass.match(/(?:term|postid)-(\d+)/);
  if (!termMatch) throw new Error('No term/postid found on page');

  const termId = termMatch[1];
  const results = [];

  const mediaType = pageUrl.includes('movie') || pageUrl.includes('film') ? 1 : 2;

  for (let i = 0; i <= 4; i++) {
    try {
      const iframeUrl = `${config.mainUrl}/?trdekho=${i}&trid=${termId}&trtype=${mediaType}`;
      const resp = await client.get(iframeUrl);
      const $$ = cheerio.load(resp.data);
      const src = $$('iframe').attr('src');
      if (src) {
        results.push({
          server: `options-${i}`,
          embed: src,
        });
      }
    } catch {
      continue;
    }
  }

  cache.set(cacheKey, results);
  return results;
}

async function getRecentlyAdded() {
  const cacheKey = 'recently_added';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const $ = await fetchPage(config.mainUrl);

  const results = [];
  $('article').each((_, el) => {
    const parsed = parseArticleCard($, el);
    if (parsed) {
      results.push({
        title: parsed.title,
        anime_id: parsed.anime_id,
        season: null,
        episode: null,
        poster: parsed.poster,
      });
    }
  });

  cache.set(cacheKey, results);
  return results;
}

async function getSeriesList(page = 1) {
  const $ = await fetchPage(`${config.mainUrl}/serie/page/${page}/`);

  const results = [];
  $('article').each((_, el) => {
    const parsed = parseArticleCard($, el);
    if (parsed) results.push(parsed);
  });

  return results;
}

async function getMoviesList(page = 1) {
  const $ = await fetchPage(`${config.mainUrl}/movie/page/${page}/`);

  const results = [];
  $('article').each((_, el) => {
    const parsed = parseArticleCard($, el);
    if (parsed) results.push(parsed);
  });

  return results;
}

async function getMovieInfo(animeId) {
  const url = fixUrl(`/anime/${animeId}/`);
  const $ = await fetchPage(url);

  const title =
    $('h1.entry-title').text().trim().replace(/^Watch Online\s*/i, '') ||
    $('meta[property=og:title]').attr('content')?.replace(/^Watch Online\s*/i, '').replace(/\s*Movie in Hindi Dubbed Free\s*$/i, '') ||
    'No Title';

  const poster = fixUrl(
    $('div.post-thumbnail figure img').attr('src') || $('meta[property=og:image]').attr('content')
  );

  const overview =
    $('div.entry-content p').first().text().trim() ||
    $('meta[name=twitter:description]').attr('content') ||
    '';

  const yearText = $('span.year').text().trim() || $('meta[property=og:updated_time]').attr('content') || '';
  const year = yearText.match(/\d{4}/)?.[0] || null;

  const rating = $('span[itemprop="ratingValue"]').text().trim() || null;

  const genres = [];
  $('a[rel="tag"]').each((_, el) => {
    const tag = $(el).text().trim();
    if (tag) genres.push(tag);
  });

  const languages = [];
  $('span.language, span.lang').each((_, el) => {
    const lang = $(el).text().trim();
    if (lang) languages.push(lang);
  });

  const stream = await extractIframeLinks(url);

  return {
    title,
    anime_id: animeId,
    poster,
    overview,
    languages: languages.length > 0 ? languages : undefined,
    run_time: $('span.duration').text().trim() || undefined,
    genres: [...new Set(genres)],
    year,
    rating,
    stream,
  };
}

module.exports = {
  getHomePage,
  search,
  getAnimeInfo,
  getEpisodes,
  getStreamLinks,
  getRecentlyAdded,
  getSeriesList,
  getMoviesList,
  getMovieInfo,
};
