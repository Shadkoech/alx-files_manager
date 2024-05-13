const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router();

// Route handling GET requests to /status and maps them to the getStatus method of AppController
router.get('/status', AppController.getStatus);

router.get('/stats', AppController.getStats);

module.exports = router;
