const WorkOrder = require('../models/WorkOrder');

exports.getAllWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.findAll();
    res.json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    res.status(500).json({ message: 'Error fetching work orders', error: error.message });
  }
};

exports.getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByPk(req.params.id);
    if (workOrder) {
      res.json(workOrder);
    } else {
      res.status(404).json({ message: 'Work order not found' });
    }
  } catch (error) {
    console.error('Error fetching work order by ID:', error);
    res.status(500).json({ message: 'Error fetching work order', error: error.message });
  }
};

exports.createWorkOrder = async (req, res) => {
  try {
    const newWorkOrder = await WorkOrder.create(req.body);
    res.status(201).json(newWorkOrder);
  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ message: 'Error creating work order', error: error.message });
  }
};

exports.updateWorkOrder = async (req, res) => {
  try {
    const [updated] = await WorkOrder.update(req.body, {
      where: { WorkOrderID: req.params.id }
    });
    if (updated) {
      const updatedWorkOrder = await WorkOrder.findByPk(req.params.id);
      res.json(updatedWorkOrder);
    } else {
      res.status(404).json({ message: 'Work order not found' });
    }
  } catch (error) {
    console.error('Error updating work order:', error);
    res.status(500).json({ message: 'Error updating work order', error: error.message });
  }
};

exports.deleteWorkOrder = async (req, res) => {
  try {
    const deleted = await WorkOrder.destroy({
      where: { WorkOrderID: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Work order not found' });
    }
  } catch (error) {
    console.error('Error deleting work order:', error);
    res.status(500).json({ message: 'Error deleting work order', error: error.message });
  }
};
