const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const healthRoutes = require('./routes/health');
const apiRoutes = require('./routes/api');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: config.rateLimit.window,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use(limiter);

app.use('/', healthRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
