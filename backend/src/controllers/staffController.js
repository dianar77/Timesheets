const Staff = require('../models/Staff');

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
};

exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    console.error('Error fetching staff by ID:', error);
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const newStaff = await Staff.create(req.body);
    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ message: 'Error creating staff', error: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const [updated] = await Staff.update(req.body, {
      where: { StaffID: req.params.id }
    });
    if (updated) {
      const updatedStaff = await Staff.findByPk(req.params.id);
      res.json(updatedStaff);
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Error updating staff', error: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const deleted = await Staff.destroy({
      where: { StaffID: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Error deleting staff', error: error.message });
  }
};
