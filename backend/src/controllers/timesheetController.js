const Timesheet = require('../models/Timesheet');
const moment = require('moment'); // Make sure to install moment if not already installed

exports.getAllTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.findAll();
    res.json(timesheets);
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    res.status(500).json({ message: 'Error fetching timesheets', error: error.message });
  }
};

exports.getTimesheetById = async (req, res) => {
  try {
    const timesheet = await Timesheet.findByPk(req.params.id);
    if (timesheet) {
      res.json(timesheet);
    } else {
      res.status(404).json({ message: 'Timesheet not found' });
    }
  } catch (error) {
    console.error('Error fetching timesheet:', error);
    res.status(500).json({ message: 'Error fetching timesheet', error: error.message });
  }
};

exports.createTimesheet = async (req, res) => {
  try {
    const newTimesheet = await Timesheet.create(req.body);
    res.status(201).json(newTimesheet);
  } catch (error) {
    console.error('Error creating timesheet:', error);
    res.status(400).json({ message: 'Error creating timesheet', error: error.message });
  }
};

exports.updateTimesheet = async (req, res) => {
  try {
    // Validate input data
    if (!req.body.StaffID || !req.body.WorkOrderID || !req.body.Hours) {
      throw new Error('Missing required fields');
    }

    // Format the date if it exists
    let formattedDate = null;
    if (req.body.Date) {
      const parsedDate = moment(req.body.Date, 'YYYY-MM-DD', true);
      if (!parsedDate.isValid()) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD');
      }
      formattedDate = parsedDate.format('YYYY-MM-DD');
    }

    const updateData = {
      ...req.body,
      Date: formattedDate,
      StaffID: Number(req.body.StaffID),
      WorkOrderID: Number(req.body.WorkOrderID),
      Hours: Number(req.body.Hours)
    };

    const [updated] = await Timesheet.update(updateData, {
      where: { TimesheetID: req.params.id }
    });

    if (updated) {
      const updatedTimesheet = await Timesheet.findByPk(req.params.id);
      res.json(updatedTimesheet);
    } else {
      res.status(404).json({ message: 'Timesheet not found' });
    }
  } catch (error) {
    console.error('Error updating timesheet:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ 
      message: 'Error updating timesheet', 
      error: error.message, 
      stack: error.stack,
      requestBody: req.body,
      timesheetId: req.params.id
    });
  }
};

exports.deleteTimesheet = async (req, res) => {
  try {
    const deleted = await Timesheet.destroy({
      where: { TimesheetID: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Timesheet not found' });
    }
  } catch (error) {
    console.error('Error deleting timesheet:', error);
    res.status(500).json({ message: 'Error deleting timesheet', error: error.message });
  }
};

exports.getTimesheetForDropdown = async (req, res) => {
  try {
    const timesheets = await Timesheet.findAll({
      attributes: ['TimesheetID', 'StaffID', 'WorkOrderID', 'Date', 'Hours'],
      order: [['StaffID', 'ASC']]
    });
    
    const formattedtimesheets = timesheets.map(d => ({
      id: d.TimesheetID,
      name: d.StaffID + ' - ' + d.Date
    }));
    
    res.json(formattedtimesheets);
  } catch (error) {
    console.error('Error fetching timesheets for dropdown:', error);
    res.status(500).json({ message: 'Error fetching timesheets for dropdown', error: error.message });
  }
};


exports.getTimesheetByStaff = async (req, res) => {
  try {
    const staffId = req.params.staffId;
    const timesheets = await Timesheet.findAll({
      where: { StaffID: staffId },
      attributes: ['TimesheetID', 'StaffID', 'WorkOrderID', 'Date', 'Hours'] // Add or remove attributes as needed
    });
    res.json(timesheets);
  } catch (error) {
    console.error('Error fetching timesheet by staff:', error);
    res.status(500).json({ message: 'Error fetching timesheet by staff', error: error.message });
  }
};

exports.getTimesheetByWorkOrder = async (req, res) => {
  try {
    const workorderId = req.params.workorderId;

    const timesheets = await Timesheet.findAll({
      where: { WorkOrderID: workorderId },
      attributes: ['TimesheetID', 'StaffID', 'WorkOrderID', 'Date', 'Hours'] // Add or remove attributes as needed
    });
    res.json(timesheets);
  } catch (error) {
    console.error('Error fetching timesheet by workOrder:', error);
    res.status(500).json({ message: 'Error fetching timesheet by workOrder', error: error.message });
  }
};
