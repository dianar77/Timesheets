const express = require('express');
const router = express.Router();
const disciplineController = require('../controllers/disciplineController');

router.get('/', disciplineController.getAllDisciplines);
router.get('/:id', disciplineController.getDisciplineById);
router.post('/', disciplineController.createDiscipline);
router.put('/:id', disciplineController.updateDiscipline);
router.delete('/:id', disciplineController.deleteDiscipline);

module.exports = router;
