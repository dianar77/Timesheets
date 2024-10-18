const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');

router.get('/', timesheetController.getAllTimesheets);
router.get('/:id', timesheetController.getTimesheetById);
router.post('/', timesheetController.createTimesheet);
router.put('/:id', timesheetController.updateTimesheet);
router.delete('/:id', timesheetController.deleteTimesheet);
router.get('/staff/:staffId', timesheetController.getTimesheetByStaff);
router.get('/workorder/:workorderId', timesheetController.getTimesheetByWorkOrder);
router.get('/dropdown/list', timesheetController.getTimesheetForDropdown);

module.exports = router;
