const Discipline = require('../models/Discipline');

exports.getAllDisciplines = async (req, res) => {
  try {
    const disciplines = await Discipline.findAll();
    res.json(disciplines);
  } catch (error) {
    console.error('Error fetching disciplines:', error);
    res.status(500).json({ message: 'Error fetching disciplines', error: error.message });
  }
};

exports.getDisciplineById = async (req, res) => {
  try {
    const discipline = await Discipline.findByPk(req.params.id);
    if (discipline) {
      res.json(discipline);
    } else {
      res.status(404).json({ message: 'Discipline not found' });
    }
  } catch (error) {
    console.error('Error fetching discipline:', error);
    res.status(500).json({ message: 'Error fetching discipline', error: error.message });
  }
};

exports.createDiscipline = async (req, res) => {
  try {
    const newDiscipline = await Discipline.create(req.body);
    res.status(201).json(newDiscipline);
  } catch (error) {
    console.error('Error creating discipline:', error);
    res.status(500).json({ message: 'Error creating discipline', error: error.message });
  }
};

exports.updateDiscipline = async (req, res) => {
  try {
    const [updated] = await Discipline.update(req.body, {
      where: { DisciplineID: req.params.id }
    });
    if (updated) {
      const updatedDiscipline = await Discipline.findByPk(req.params.id);
      res.json(updatedDiscipline);
    } else {
      res.status(404).json({ message: 'Discipline not found' });
    }
  } catch (error) {
    console.error('Error updating discipline:', error);
    res.status(500).json({ message: 'Error updating discipline', error: error.message });
  }
};

exports.deleteDiscipline = async (req, res) => {
  try {
    const deleted = await Discipline.destroy({
      where: { DisciplineID: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Discipline deleted successfully' });
    } else {
      res.status(404).json({ message: 'Discipline not found' });
    }
  } catch (error) {
    console.error('Error deleting discipline:', error);
    res.status(500).json({ message: 'Error deleting discipline', error: error.message });
  }
};
