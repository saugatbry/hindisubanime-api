const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`HindiSubAnime API running on port ${config.port}`);
  console.log(`Main URL: ${config.mainUrl}`);
});
