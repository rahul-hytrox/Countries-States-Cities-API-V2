const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

// GET cities by country_code and iso2 (state_code)
router.get('/:country_code/:iso2', cityController.getCities);

module.exports = router;
