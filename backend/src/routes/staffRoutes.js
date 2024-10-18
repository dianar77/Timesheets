const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);
router.get('/discipline/:disciplineId', staffController.getStaffByDiscipline);
router.get('/dropdown/list', staffController.getStaffForDropdown);

module.exports = router;
