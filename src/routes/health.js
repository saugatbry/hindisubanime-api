const express = require('express');
const router = express.Router();
const pkg = require('../../package.json');

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: Date.now() });
});

router.get('/status', (req, res) => {
  res.json({ success: true, status: 'running', uptime: process.uptime(), timestamp: Date.now() });
});

router.get('/version', (req, res) => {
  res.json({ success: true, version: pkg.version, name: pkg.name });
});

module.exports = router;
