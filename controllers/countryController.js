const { pool } = require('../config/db');

// GET all countries
exports.getAllCountries = async (req, res) => {
    try {
        const [countries] = await pool.query(
            'SELECT * FROM countries WHERE flag = 1 ORDER BY name ASC'
        );

        res.json({
            success: true,
            count: countries.length,
            data: countries
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching countries',
            error: error.message
        });
    }
};

// GET country by ID
exports.getCountryById = async (req, res) => {
    try {
        const [countries] = await pool.query(
            'SELECT * FROM countries WHERE id = ? AND flag = 1',
            [req.params.id]
        );

        if (countries.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Country not found'
            });
        }

        res.json({
            success: true,
            data: countries[0]
        });
    } catch (error) {
        console.error('Error fetching country:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching country',
            error: error.message
        });
    }
};

// GET country by ISO2 code
exports.getCountryByIso2 = async (req, res) => {
    try {
        const [countries] = await pool.query(
            'SELECT * FROM countries WHERE iso2 = ? AND flag = 1',
            [req.params.iso2.toUpperCase()]
        );

        if (countries.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Country not found'
            });
        }

        res.json({
            success: true,
            data: countries[0]
        });
    } catch (error) {
        console.error('Error fetching country:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching country',
            error: error.message
        });
    }
};

// GET countries by region
exports.getCountriesByRegion = async (req, res) => {
    try {
        const [countries] = await pool.query(
            'SELECT * FROM countries WHERE region = ? AND flag = 1 ORDER BY name ASC',
            [req.params.region]
        );

        res.json({
            success: true,
            count: countries.length,
            data: countries
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching countries',
            error: error.message
        });
    }
};
