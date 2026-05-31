# HindiSubAnime API

REST API for [hindisubanime.co](https://hindisubanime.co) — scrape anime info, episodes, and stream embed links.

Base URL: `https://hindisubanime-api.vercel.app`

---

## Endpoints

### Health & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/status` | Server status with uptime |
| GET | `/version` | API version |

---

### Home Page `GET /api`

Returns categorized anime listings (Shounen, Action, Fantasy, Series).

```
GET /api
```

<details>
<summary>Response</summary>

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

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `s` | string | yes | — |
| `page` | number | no | 1 |

<details>
<summary>Response</summary>

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
        "title": "One Piece: Stampede",
        "anime_id": "one-piece-stampede",
        "poster": "https://image.tmdb.org/t/p/w500/lTmEC8wYMnivC4inWDthavlMkBS.jpg",
        "url": "https://hindisubanime.co/movies/one-piece-stampede/"
      }
    ]
  }
}
```

</details>

---

### Anime Info `GET /api/info`

Returns full anime details including all episodes across all seasons.

```
GET /api/info?id=jujutsu-kaisen
```

| Param | Type | Required |
|-------|------|----------|
| `id` | string | yes |

<details>
<summary>Response</summary>

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

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `id` | string | yes | — |
| `season` | number | no | 1 |

<details>
<summary>Response</summary>

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

| Param | Type | Required |
|-------|------|----------|
| `id` | string | yes |
| `season` | number | yes |
| `ep` | number | yes |

<details>
<summary>Response</summary>

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
<summary>Response</summary>

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

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `page` | number | no | 1 |

---

### Movies List `GET /api/movies`

```
GET /api/movies?page=1
```

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `page` | number | no | 1 |

---

### Movie Info & Stream `GET /api/movie`

Returns movie details with direct stream embed links.

```
GET /api/movie?id=one-piece-film-red
```

| Param | Type | Required |
|-------|------|----------|
| `id` | string | yes |

<details>
<summary>Response</summary>

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

## Usage Examples

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

// Search
const search = await axios.get(`${BASE}/api/search?s=jujutsu&page=1`);
console.log(search.data);

// Anime Info
const info = await axios.get(`${BASE}/api/info?id=jujutsu-kaisen`);
console.log(info.data);

// Episodes
const episodes = await axios.get(`${BASE}/api/episodes?id=jujutsu-kaisen&season=1`);
console.log(episodes.data);

// Stream Links
const stream = await axios.get(`${BASE}/api/stream?id=one-piece&season=1&ep=1`);
console.log(stream.data);

// Movie
const movie = await axios.get(`${BASE}/api/movie?id=one-piece-film-red`);
console.log(movie.data);
```

### Python

```python
import requests

BASE = "https://hindisubanime-api.vercel.app"

resp = requests.get(f"{BASE}/api/search", params={"s": "jujutsu", "page": 1})
print(resp.json())

resp = requests.get(f"{BASE}/api/stream", params={"id": "one-piece", "season": 1, "ep": 1})
print(resp.json())
```

---

## Local Development

```bash
git clone https://github.com/saugatbry/hindisubanime-api.git
cd hindisubanime-api
npm install
npm start
```

Server starts at `http://localhost:3000`.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `MAIN_URL` | https://hindisubanime.co | Source website |
| `CACHE_TTL` | 300 | Cache TTL in seconds |

---

## Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Notes

- Responses are cached (default 5 min TTL) for performance.
- Rate limited to 100 requests per 15 minutes per IP.
- The API scrapes [hindisubanime.co](https://hindisubanime.co) in real-time — availability depends on the source site.
