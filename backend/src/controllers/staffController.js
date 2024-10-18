const Staff = require('../models/staff');

exports.getAllStaff = async (req, res) => {
  try {
    const staffs = await Staff.findAll();
    res.json(staffs);
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
    console.error('Error fetching staff:', error);
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
      res.json({ message: 'Staff deleted successfully' });
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Error deleting staff', error: error.message });
  }
};

exports.getStaffForDropdown = async (req, res) => {
  try {
    console.log("XXXgetStaffForDropdown");
    const staffs = await Staff.findAll({
      attributes: ['StaffID', 'Name'],
      order: [['Name', 'ASC']]
    });
    
    const formattedstaffs = staffs.map(d => ({
      id: d.StaffID,
      name: d.Name
    }));
    
    res.json(formattedstaffs);
  } catch (error) {
    console.error('Error fetching staff for dropdown:', error);
    res.status(500).json({ message: 'Error fetching staff for dropdown', error: error.message });
  }
};

exports.getStaffByDiscipline = async (req, res) => {
  try {
    const disciplineId = req.params.disciplineId;
    const staffs = await Staff.findAll({
      where: { DisciplineID: disciplineId },
      attributes: ['StaffID', 'Name', 'PersonalID', 'DisciplineID'] // Add or remove attributes as needed
    });
    res.json(staffs);
  } catch (error) {
    console.error('Error fetching staff by discipline:', error);
    res.status(500).json({ message: 'Error fetching staff by discipline', error: error.message });
  }
};

