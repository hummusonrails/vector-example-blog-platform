const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Route for performing vector search
router.post('/', searchController.performSearch);

module.exports = router;