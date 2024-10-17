const { sql, poolPromise } = require('../config/database');

class Timesheet {
  static async getAll(filters = {}, sort = {}) {
    try {
      const pool = await poolPromise;
      let query = `
        SELECT t.TimesheetID, s.Name as StaffName, w.Task#, w.Description, p.Name as ProjectName, 
               v.Name as VesselName, c.Name as ClientName, t.Date, t.Hours
        FROM Timesheets t
        JOIN Staff s ON t.StaffID = s.StaffID
        JOIN WorkOrders w ON t.WorkOrderID = w.WorkOrderID
        JOIN Projects p ON w.ProjectID = p.ProjectID
        JOIN Vessels v ON p.VesselID = v.VesselID
        JOIN Clients c ON v.ClientID = c.ClientID
      `;

      const whereConditions = [];
      const queryParams = {};

      if (filters.staffId) {
        whereConditions.push('t.StaffID = @staffId');
        queryParams.staffId = filters.staffId;
      }

      if (filters.projectId) {
        whereConditions.push('p.ProjectID = @projectId');
        queryParams.projectId = filters.projectId;
      }

      if (filters.startDate) {
        whereConditions.push('t.Date >= @startDate');
        queryParams.startDate = filters.startDate;
      }

      if (filters.endDate) {
        whereConditions.push('t.Date <= @endDate');
        queryParams.endDate = filters.endDate;
      }

      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ');
      }

      if (sort.field && sort.order) {
        query += ` ORDER BY ${sort.field} ${sort.order}`;
      }

      const request = pool.request();
      for (const [key, value] of Object.entries(queryParams)) {
        request.input(key, value);
      }

      const result = await request.query(query);
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
        .query(`
          SELECT t.TimesheetID, s.Name as StaffName, w.Task#, w.Description, p.Name as ProjectName, 
                 v.Name as VesselName, c.Name as ClientName, t.Date, t.Hours
          FROM Timesheets t
          JOIN Staff s ON t.StaffID = s.StaffID
          JOIN WorkOrders w ON t.WorkOrderID = w.WorkOrderID
          JOIN Projects p ON w.ProjectID = p.ProjectID
          JOIN Vessels v ON p.VesselID = v.VesselID
          JOIN Clients c ON v.ClientID = c.ClientID
          WHERE t.TimesheetID = @id
        `);
      return result.recordset[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  static async create(timesheetData) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('staffId', sql.Int, timesheetData.staffId)
        .input('workOrderId', sql.Int, timesheetData.workOrderId)
        .input('date', sql.Date, timesheetData.date)
        .input('hours', sql.Float, timesheetData.hours)
        .query(`
          INSERT INTO Timesheets (StaffID, WorkOrderID, Date, Hours)
          VALUES (@staffId, @workOrderId, @date, @hours);
          SELECT SCOPE_IDENTITY() AS TimesheetID;
        `);
      return result.recordset[0];
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  static async update(id, timesheetData) {
    try {
      const pool = await poolPromise;
      await pool
        .request()
        .input('id', sql.Int, id)
        .input('staffId', sql.Int, timesheetData.staffId)
        .input('workOrderId', sql.Int, timesheetData.workOrderId)
        .input('date', sql.Date, timesheetData.date)
        .input('hours', sql.Float, timesheetData.hours)
        .query(`
          UPDATE Timesheets
          SET StaffID = @staffId, WorkOrderID = @workOrderId, Date = @date, Hours = @hours
          WHERE TimesheetID = @id
        `);
      return { TimesheetID: id, ...timesheetData };
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const pool = await poolPromise;
      await pool
        .request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Timesheets WHERE TimesheetID = @id');
      return { TimesheetID: id };
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}

module.exports = Timesheet;
