const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/vessel/:vesselId', projectController.getProjectByVessel);
router.get('/dropdown/list', projectController.getProjectForDropdown);
module.exports = router;
