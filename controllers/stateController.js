const { pool } = require('../config/db');

// GET all states
exports.getAllStates = async (req, res) => {
    try {
        const [states] = await pool.query(
            `SELECT s.*, c.name as country_name 
       FROM states s 
       LEFT JOIN countries c ON s.country_id = c.id 
       WHERE s.flag = 1 
       ORDER BY s.name ASC`
        );

        res.json({
            success: true,
            count: states.length,
            data: states
        });
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching states',
            error: error.message
        });
    }
};

// GET state by ID
exports.getStateById = async (req, res) => {
    try {
        const [states] = await pool.query(
            `SELECT s.*, c.name as country_name 
       FROM states s 
       LEFT JOIN countries c ON s.country_id = c.id 
       WHERE s.id = ? AND s.flag = 1`,
            [req.params.id]
        );

        if (states.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'State not found'
            });
        }

        res.json({
            success: true,
            data: states[0]
        });
    } catch (error) {
        console.error('Error fetching state:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching state',
            error: error.message
        });
    }
};

// GET states by country ISO2 code
exports.getStatesByCountryCode = async (req, res) => {
    try {
        const countryCode = req.params.iso2.toUpperCase();

        const [states] = await pool.query(
            `SELECT s.*, c.name as country_name 
       FROM states s 
       LEFT JOIN countries c ON s.country_id = c.id 
       WHERE s.country_code = ? AND s.flag = 1 
       ORDER BY s.name ASC`,
            [countryCode]
        );

        res.json({
            success: true,
            count: states.length,
            data: states
        });
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching states by country code',
            error: error.message
        });
    }
};

// GET states by country ID
exports.getStatesByCountryId = async (req, res) => {
    try {
        const [states] = await pool.query(
            `SELECT s.*, c.name as country_name 
       FROM states s 
       LEFT JOIN countries c ON s.country_id = c.id 
       WHERE s.country_id = ? AND s.flag = 1 
       ORDER BY s.name ASC`,
            [req.params.countryId]
        );

        res.json({
            success: true,
            count: states.length,
            data: states
        });
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching states by country ID',
            error: error.message
        });
    }
};
