const Vessel = require('../models/Vessel');

exports.getAllVessels = async (req, res) => {
  try {
    console.log('Fetching all vessels');
    const vessels = await Vessel.findAll();
    console.log('Vessels fetched:', vessels);
    res.json(vessels);
  } catch (error) {
    console.error('Error fetching vessels:', error);
    res.status(500).json({ message: 'Error fetching vessels', error: error.message });
  }
};

exports.getVesselById = async (req, res) => {
  try {
    const vessel = await Vessel.findByPk(req.params.id);
    if (vessel) {
      res.json(vessel);
    } else {
      res.status(404).json({ message: 'Vessel not found' });
    }
  } catch (error) {
    console.error('Error fetching vessel:', error);
    res.status(500).json({ message: 'Error fetching vessel', error: error.message });
  }
};

exports.createVessel = async (req, res) => {
  try {
    const newVessel = await Vessel.create(req.body);
    res.status(201).json(newVessel);
  } catch (error) {
    console.error('Error creating vessel:', error);
    res.status(400).json({ message: 'Error creating vessel', error: error.message });
  }
};

exports.updateVessel = async (req, res) => {
  try {
    const [updated] = await Vessel.update(req.body, {
      where: { VesselID: req.params.id }
    });
    if (updated) {
      const updatedVessel = await Vessel.findByPk(req.params.id);
      res.json(updatedVessel);
    } else {
      res.status(404).json({ message: 'Vessel not found' });
    }
  } catch (error) {
    console.error('Error updating vessel:', error);
    res.status(400).json({ message: 'Error updating vessel', error: error.message });
  }
};

exports.deleteVessel = async (req, res) => {
  try {
    const deleted = await Vessel.destroy({
      where: { VesselID: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Vessel not found' });
    }
  } catch (error) {
    console.error('Error deleting vessel:', error);
    res.status(500).json({ message: 'Error deleting vessel', error: error.message });
  }
};
