const Staff = require('../models/Staff');

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.getAll();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error });
  }
};

exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.getById(req.params.id);
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error });
  }
};
