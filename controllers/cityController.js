const { pool } = require('../config/db');

// GET cities by country code and state code (iso2)
exports.getCities = async (req, res) => {
    try {
        const countryCode = req.params.country_code.toUpperCase();
        const stateCode = req.params.iso2.toUpperCase();

        const [cities] = await pool.query(
            `SELECT * FROM cities 
             WHERE country_code = ? 
             AND state_code = ? 
             AND flag = 1 
             ORDER BY name ASC`,
            [countryCode, stateCode]
        );

        res.json({
            success: true,
            count: cities.length,
            data: cities
        });
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cities',
            error: error.message
        });
    }
};
