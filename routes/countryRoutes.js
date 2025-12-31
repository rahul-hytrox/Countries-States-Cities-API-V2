const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// GET all countries
router.get('/', countryController.getAllCountries);

// GET country by ID
router.get('/:id', countryController.getCountryById);

// GET country by ISO2 code
router.get('/iso/:iso2', countryController.getCountryByIso2);

// GET countries by region
router.get('/region/:region', countryController.getCountriesByRegion);

module.exports = router;
