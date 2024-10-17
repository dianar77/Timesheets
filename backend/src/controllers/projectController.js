const sql = require('mssql');
const config = require('../config/dbConfig');

exports.getAllProjects = async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Projects');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};
