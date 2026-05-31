<h1 align="center">🎬 HindiSubAnime API</h1>
<h3 align="center">REST API for hindisubanime.co — Anime Info, Episodes & Stream Embeds</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="MIT">
</p>

<p align="center">
  <a href="https://hindisubanime-api.vercel.app/health" target="_blank">
    <img src="https://img.shields.io/badge/Status-Online-success?style=flat-square" alt="Status">
  </a>
  <a href="https://github.com/saugatbry/hindisubanime-api">
    <img src="https://img.shields.io/github/stars/saugatbry/hindisubanime-api?style=flat-square" alt="Stars">
  </a>
  <a href="https://github.com/saugatbry/hindisubanime-api/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/saugatbry/hindisubanime-api?style=flat-square" alt="License">
  </a>
</p>

---

## 📋 Table of Contents

- [Base URL](#-base-url)
- [Endpoints](#-endpoints)
  - [Home Page](#home-page-get-api)
  - [Search](#search-get-apisearch)
  - [Anime Info](#anime-info-get-apiinfo)
  - [Episodes](#episodes-get-apiepisodes)
  - [Stream](#stream-get-apistream)
  - [Recently Added](#recently-added-get-apinewadded)
  - [Series List](#series-list-get-apiseries)
  - [Movies List](#movies-list-get-apimovies)
  - [Movie Info](#movie-info-get-apimovie)
  - [Health & Status](#health--status)
- [Usage Examples](#-usage-examples)
- [Local Development](#-local-development)
- [Rate Limits](#-rate-limits)
- [Error Handling](#-error-handling)
- [DMCA & Takedown](#-dmca--takedown)
- [License](#-license)

---

## 🌐 Base URL

```
https://hindisubanime-api.vercel.app
```

---

## 📡 Endpoints

### Home Page `GET /api`

Returns categorized anime listings.

```
GET /api
```

<details>
<summary><b>📥 Response</b></summary>

```json
{
  "success": true,
  "message": "Data Found!!",
  "results": {
    "Shounen": [
      {
        "title": "One Piece",
        "anime_id": "one-piece",
        "poster": "https://image.tmdb.org/t/p/w500/uiIB9ctqZFbfRXXimtpmZb5dusi.jpg",
        "url": "https://hindisubanime.co/serie/one-piece/"
      }
    ],
    "Action": [...],
    "Fantasy": [...],
    "Series": [...]
  }
}
```

</details>

---

### Search `GET /api/search`

```
GET /api/search?s={query}&page={page}
```

#### Parameters

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `s` | string | ✅ Yes | — |
| `page` | number | ❌ No | 1 |

<details>
<summary><b>📥 Response</b></summary>

```json
{
  "success": true,
  "message": "Data Found!!",
  "results": {
    "currentPage": 1,
    "totalPages": 1,
    "results": [
      {
        "title": "One Piece",
        "anime_id": "one-piece",
        "poster": "https://image.tmdb.org/t/p/w500/uiIB9ctqZFbfRXXimtpmZb5dusi.jpg",
        "url": "https://hindisubanime.co/serie/one-piece/"
      },
      {
        "title": "One Piece Film Red",
        "anime_id": "one-piece-film-red",
        "poster": "https://image.tmdb.org/t/p/w500/ogDXuVkO92GcETZfSofXXemw7gb.jpg",
        "url": "https://hindisubanime.co/movies/one-piece-film-red/"
      }
    ]
  }
}
```

</details>

---

### Anime Info `GET /api/info`

Returns full anime details with all episodes across all seasons.

```
GET /api/info?id=jujutsu-kaisen
```

#### Parameters

| Param | Type | Required |
|-------|------|----------|
| `id` | string | ✅ Yes |

<details>
<summary><b>📥 Response</b></summary>

```json
{
  "success": true,
  "cached": false,
  "data": {
    "title": "Jujutsu Kaisen",
    "anime_id": "jujutsu-kaisen",
    "poster": "https://image.tmdb.org/t/p/w500/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg",
    "overview": "Yuji Itadori is a boy with tremendous physical strength...",
    "year": "2020",
    "genres": [],
    "totalSeasons": 1,
    "totalEpisodes": 59,
    "type": "Series",
    "episodes": [
      {
        "title": "Ryomen Sukuna",
        "season": 1,
        "episode": 1,
        "episode_url": "https://hindisubanime.co/epi/jujutsu-kaisen-1x1/",
        "poster": "https://image.tmdb.org/t/p/w185/3wymoL9HYpllpFrcD8VCvemktGg.jpg"
      }
    ]
  }
}
```

</details>

---

### Episodes `GET /api/episodes`

Returns episodes for a specific season.

```
GET /api/episodes?id=jujutsu-kaisen&season=1
```

#### Parameters

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `id` | string | ✅ Yes | — |
| `season` | number | ❌ No | 1 |

<details>
<summary><b>📥 Response</b></summary>

```json
{
  "success": true,
  "message": "Data scraped!!",
  "results": {
    "totalEpisodes": 59,
    "episodes": [
      {
        "title": "Ryomen Sukuna",
        "season": 1,
        "episode": 1,
        "poster": "https://image.tmdb.org/t/p/w185/3wymoL9HYpllpFrcD8VCvemktGg.jpg",
        "episode_url": "https://hindisubanime.co/epi/jujutsu-kaisen-1x1/"
      }
    ]
  }
}
```

</details>

---

### Stream `GET /api/stream`

Returns embed/iframe streaming URLs for a specific episode.

```
GET /api/stream?id=one-piece&season=1&ep=1
```

#### Parameters

| Param | Type | Required |
|-------|------|----------|
| `id` | string | ✅ Yes |
| `season` | number | ✅ Yes |
| `ep` | number | ✅ Yes |

<details>
<summary><b>📥 Response</b></summary>

```json
{
  "success": true,
  "message": "Data Found!!",
  "results": [
    {
      "server": "options-0",
      "embed": "https://vidstreamnew.xyz/v/DaoQEaZxMwgv/"
    },
    {
      "server": "options-1",
      "embed": "https://abyssplayer.com/SPkPypc-mo"
    }
  ]
}
```

</details>

---

### Recently Added `GET /api/newadded`

Returns latest anime added to the site.

```
GET /api/newadded
```

<details>
<summary><b>📥 Response</b></summary>

```json
{
  "success": true,
  "message": "Data Found!!",
  "results": [
    {
      "title": "Rooster Fighter",
      "anime_id": "rooster-fighter",
      "season": null,
      "episode": null,
      "poster": "https://image.tmdb.org/t/p/w342/iCtbr0sIdaKZjhQH3Wr7hW6A1IU.jpg"
    }
  ]
}
```

</details>

---

### Series List `GET /api/series`

```
GET /api/series?page=1
```

#### Parameters

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `page` | number | ❌ No | 1 |

---

### Movies List `GET /api/movies`

```
GET /api/movies?page=1
```

#### Parameters

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `page` | number | ❌ No | 1 |

---

### Movie Info `GET /api/movie`

Returns movie details with direct stream embed links.

```
GET /api/movie?id=one-piece-film-red
```

#### Parameters

| Param | Type | Required |
|-------|------|----------|
| `id` | string | ✅ Yes |

<details>
<summary><b>📥 Response</b></summary>

```json
{
  "success": true,
  "message": "data found",
  "results": {
    "title": "One Piece Film Red",
    "anime_id": "one-piece-film-red",
    "poster": "https://image.tmdb.org/t/p/w500/ogDXuVkO92GcETZfSofXXemw7gb.jpg",
    "overview": "Uta — the most beloved singer in the world...",
    "genres": [],
    "year": "2025",
    "rating": null,
    "stream": [
      {
        "server": "options-0",
        "embed": "https://abyssplayer.com/Dvr3fJjw61"
      },
      {
        "server": "options-1",
        "embed": "https://gdmirrorbot.nl/embed/tyqfa0o"
      },
      {
        "server": "options-2",
        "embed": "https://vidstreamnew.xyz/v/4f3lgLxoecWe/"
      }
    ]
  }
}
```

</details>

---

### Health & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/status` | Server status with uptime |
| GET | `/version` | API version |

---

## 💻 Usage Examples

### cURL

```bash
curl "https://hindisubanime-api.vercel.app/api/search?s=naruto&page=1"
curl "https://hindisubanime-api.vercel.app/api/info?id=naruto"
curl "https://hindisubanime-api.vercel.app/api/stream?id=naruto&season=1&ep=1"
```

### JavaScript (Axios)

```js
import axios from "axios";

const BASE = "https://hindisubanime-api.vercel.app";

const search = await axios.get(`${BASE}/api/search?s=jujutsu&page=1`);
console.log(search.data);

const info = await axios.get(`${BASE}/api/info?id=jujutsu-kaisen`);
console.log(info.data);

const episodes = await axios.get(`${BASE}/api/episodes?id=jujutsu-kaisen&season=1`);
console.log(episodes.data);

const stream = await axios.get(`${BASE}/api/stream?id=one-piece&season=1&ep=1`);
console.log(stream.data);

const movie = await axios.get(`${BASE}/api/movie?id=one-piece-film-red`);
console.log(movie.data);
```

### Python

```python
import requests

BASE = "https://hindisubanime-api.vercel.app"

resp = requests.get(f"{BASE}/api/search", params={"s": "jujutsu", "page": 1})
print(resp.json())

resp = requests.get(f"{BASE}/api/stream", params={
    "id": "one-piece", "season": 1, "ep": 1
})
print(resp.json())
```

---

## 🛠️ Local Development

```bash
git clone https://github.com/saugatbry/hindisubanime-api.git
cd hindisubanime-api
npm install
npm start
```

Server runs at `http://localhost:3000`.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `MAIN_URL` | `https://hindisubanime.co` | Source website |
| `CACHE_TTL` | `300` | Cache TTL in seconds |
| `RATE_LIMIT_WINDOW` | `15` | Rate limit window in minutes |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

---

## 🚦 Rate Limits

| Limit | Value |
|-------|-------|
| Requests | 100 per 15 minutes |
| Window | 15 minutes |
| Response on limit | `429 Too Many Requests` |

When rate limited, the API returns:

```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## ⚠️ Error Handling

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `400` | Bad request — missing parameters |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## ⚖️ DMCA & Takedown

This project is **purely educational and for research purposes only**. It functions as an API wrapper that scrapes publicly available data from the web. The project is not affiliated with, endorsed by, or connected to any third-party content providers.

### Disclaimer

- This API does **not host, store, or distribute** any copyrighted content.
- All data is scraped in real-time from publicly accessible web pages.
- All video streams and media content are hosted by third-party services not affiliated with this project.
- This project does **not encourage piracy or copyright infringement** in any form.

### Takedown Request

If you are a copyright owner or an agent thereof and believe that any content available through this API infringes upon your copyrights, please submit a takedown request by opening an issue on GitHub or contacting the repository owner directly. Upon receiving a valid takedown notice, appropriate action will be taken within 48 hours, which may include removal of references to the infringing content.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ using Node.js & Express
  <br>
  <a href="https://github.com/saugatbry/hindisubanime-api">GitHub</a>
  ·
  <a href="https://hindisubanime-api.vercel.app">Live API</a>
</p>
