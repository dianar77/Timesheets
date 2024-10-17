const sql = require('mssql');
const config = require('../config/dbConfig');

exports.getAllWorkOrders = async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM WorkOrders');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    res.status(500).json({ message: 'Error fetching work orders', error: error.message });
  }
};

exports.getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByPk(req.params.id);
    if (workOrder) {
      res.json(workOrder);
    } else {
      res.status(404).json({ message: 'Work order not found' });
    }
  } catch (error) {
    console.error('Error fetching work order by ID:', error);
    res.status(500).json({ message: 'Error fetching work order', error: error.message });
  }
};

exports.createWorkOrder = async (req, res) => {
  try {
    const { Task, Description, ProjectID } = req.body;
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('Task', sql.Int, Task)
      .input('Description', sql.NVarChar(2000), Description)
      .input('ProjectID', sql.Int, ProjectID)
      .query('INSERT INTO WorkOrders (Task#, Description, ProjectID) OUTPUT INSERTED.* VALUES (@Task, @Description, @ProjectID)');
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ message: 'Error creating work order', error: error.message });
  }
};

exports.updateWorkOrder = async (req, res) => {
  try {
    const { Task, Description, ProjectID } = req.body;
    const { id } = req.params;
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('WorkOrderID', sql.Int, id)
      .input('Task', sql.Int, Task)
      .input('Description', sql.NVarChar(2000), Description)
      .input('ProjectID', sql.Int, ProjectID)
      .query('UPDATE WorkOrders SET Task# = @Task, Description = @Description, ProjectID = @ProjectID OUTPUT INSERTED.* WHERE WorkOrderID = @WorkOrderID');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Work Order not found' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating work order:', error);
    res.status(500).json({ message: 'Error updating work order', error: error.message });
  }
};

exports.deleteWorkOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('WorkOrderID', sql.Int, id)
      .query('DELETE FROM WorkOrders WHERE WorkOrderID = @WorkOrderID');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Work Order not found' });
    }
    res.json({ message: 'Work Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting work order:', error);
    res.status(500).json({ message: 'Error deleting work order', error: error.message });
  }
};
