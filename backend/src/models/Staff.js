const { sql, poolPromise } = require('../config/database');

class Staff {
  static async getAll() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM Staff');
      return result.recordset;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Staff WHERE StaffID = @id');
      return result.recordset[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }
}

module.exports = Staff;
