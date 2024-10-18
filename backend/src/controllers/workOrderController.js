const WorkOrder = require('../models/WorkOrder');

exports.getAllWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.findAll();
    res.json(workOrders);
  } catch (error) {
    console.error('Error fetching Work Orders:', error);
    res.status(500).json({ message: 'Error fetching Work Orders', error: error.message });
  }
};

exports.getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.getById(req.params.id);
    if (workOrder) {
      res.json(workOrder);
    } else {
      res.status(404).json({ message: 'Work Order not found' });
    }
  } catch (error) {
    console.error('Error fetching Work Order:', error);
    res.status(500).json({ message: 'Error fetching WorkOrder', error: error.message });
  }
};

exports.createWorkOrder = async (req, res) => {
  try {
    const newWorkOrder = new WorkOrder(req.body);
    const createdWorkOrder = await newWorkOrder.create();
    res.status(201).json(createdWorkOrder);
  } catch (error) {
    console.error('Error creating Work Order:', error);
    res.status(500).json({ message: 'Error creating WorkOrder', error: error.message });
  }
};

exports.updateWorkOrder = async (req, res) => {
  try {
    const workOrder = new WorkOrder({ ...req.body, WorkOrderID: req.params.id });
    const updatedWorkOrder = await workOrder.update();
    if (updatedWorkOrder) {
      res.json(updatedWorkOrder);
    } else {
      res.status(404).json({ message: 'Work Order not found' });
    }
  } catch (error) {
    console.error('Error updating Work Order:', error);
    res.status(500).json({ message: 'Error updating Work Order', error: error.message });
  }
};

exports.deleteWorkOrder = async (req, res) => {
  try {
    const result = await WorkOrder.delete(req.params.id);
    if (result) {
      res.json({ message: 'Work Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Work Order not found' });
    }
  } catch (error) {
    console.error('Error deleting Work Order:', error);
    res.status(500).json({ message: 'Error deleting Work Order', error: error.message });
  }
};

exports.getWorkOrderForDropdown = async (req, res) => {
    try {
      const workOrders = await WorkOrder.findAll({
        attributes: ['WorkOrderID', 'Task', 'Description'],
        order: [['Task', 'ASC']]
      });
      
      const formattedworkOrders = workOrders.map(d => ({
        id: d.WorkOrderID,
        name: d.Task + ' - ' + d.Description
      }));
      
      res.json(formattedworkOrders);
    } catch (error) {
      console.error('Error fetching work orders for dropdown:', error);
      res.status(500).json({ message: 'Error fetching work orders for dropdown', error: error.message });
    }
  };

  exports.getWorkOrderByProject = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const workOrders = await WorkOrder.findAll({
        where: { ProjectID: projectId },
        attributes: ['WorkOrderID', 'Task', 'Description', 'ProjectID'] // Add or remove attributes as needed
      });
      res.json(workOrders);
    } catch (error) {
      console.error('Error fetching work order by project:', error);
      res.status(500).json({ message: 'Error fetching work order by project', error: error.message });
    }
  };

