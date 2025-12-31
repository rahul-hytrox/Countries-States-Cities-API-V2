const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');

// GET all states
router.get('/', stateController.getAllStates);

// GET state by ID
router.get('/:id', stateController.getStateById);

// GET states by country ISO2 code (main requirement)
router.get('/country/:iso2', stateController.getStatesByCountryCode);

// GET states by country ID (alternative)
router.get('/country-id/:countryId', stateController.getStatesByCountryId);

module.exports = router;
