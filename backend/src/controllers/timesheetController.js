const Timesheet = require('../models/Timesheet');

exports.getAllTimesheets = async (req, res) => {
  try {
    const filters = {
      staffId: req.query.staffId,
      projectId: req.query.projectId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    const sort = {
      field: req.query.sortField,
      order: req.query.sortOrder,
    };
    const timesheets = await Timesheet.getAll(filters, sort);
    res.json(timesheets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timesheets', error });
  }
};

exports.getTimesheetById = async (req, res) => {
  try {
    const timesheet = await Timesheet.getById(req.params.id);
    if (timesheet) {
      res.json(timesheet);
    } else {
      res.status(404).json({ message: 'Timesheet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timesheet', error });
  }
};

exports.createTimesheet = async (req, res) => {
  try {
    const newTimesheet = await Timesheet.create(req.body);
    res.status(201).json(newTimesheet);
  } catch (error) {
    res.status(500).json({ message: 'Error creating timesheet', error });
  }
};

exports.updateTimesheet = async (req, res) => {
  try {
    const updatedTimesheet = await Timesheet.update(req.params.id, req.body);
    res.json(updatedTimesheet);
  } catch (error) {
    res.status(500).json({ message: 'Error updating timesheet', error });
  }
};

exports.deleteTimesheet = async (req, res) => {
  try {
    await Timesheet.delete(req.params.id);
    res.json({ message: 'Timesheet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting timesheet', error });
  }
};
