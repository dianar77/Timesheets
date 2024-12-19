const WorkOrder = require('../../models/WorkOrder');
const workOrderController = require('../workOrderController');

// Mock the WorkOrder model
jest.mock('../../models/WorkOrder');

describe('Work Order Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request and response
    mockRequest = {
      params: {},
      body: {}
    };
    
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('getAllWorkOrders', () => {
    it('should return all work orders successfully', async () => {
      const mockWorkOrders = [
        { WorkOrderID: 1, Task: 'Task 1' },
        { WorkOrderID: 2, Task: 'Task 2' }
      ];
      
      WorkOrder.findAll.mockResolvedValue(mockWorkOrders);
      
      await workOrderController.getAllWorkOrders(mockRequest, mockResponse);
      
      expect(WorkOrder.findAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockWorkOrders);
    });

    it('should handle errors when fetching work orders', async () => {
      const error = new Error('Database error');
      WorkOrder.findAll.mockRejectedValue(error);
      
      await workOrderController.getAllWorkOrders(mockRequest, mockResponse);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error fetching Work Orders',
        error: error.message
      });
    });
  });

  describe('getWorkOrderById', () => {
    it('should return a work order when found', async () => {
      const mockWorkOrder = { WorkOrderID: 1, Task: 'Task 1' };
      mockRequest.params.id = 1;
      
      WorkOrder.findByPk.mockResolvedValue(mockWorkOrder);
      
      await workOrderController.getWorkOrderById(mockRequest, mockResponse);
      
      expect(WorkOrder.findByPk).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockWorkOrder);
    });

    it('should return 404 when work order is not found', async () => {
      mockRequest.params.id = 999;
      WorkOrder.findByPk.mockResolvedValue(null);
      
      await workOrderController.getWorkOrderById(mockRequest, mockResponse);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Work Order not found' });
    });
  });

  describe('createWorkOrder', () => {
    it('should create a new work order successfully', async () => {
      const mockWorkOrder = { Task: 'New Task', Description: 'Test' };
      mockRequest.body = mockWorkOrder;
      
      const createdWorkOrder = { ...mockWorkOrder, WorkOrderID: 1 };
      WorkOrder.prototype.create.mockResolvedValue(createdWorkOrder);
      
      await workOrderController.createWorkOrder(mockRequest, mockResponse);
      
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdWorkOrder);
    });
  });

  describe('updateWorkOrder', () => {
    it('should update a work order successfully', async () => {
      const mockWorkOrder = { Task: 'Updated Task' };
      mockRequest.body = mockWorkOrder;
      mockRequest.params.id = 1;
      
      const updatedWorkOrder = { ...mockWorkOrder, WorkOrderID: 1 };
      WorkOrder.prototype.update.mockResolvedValue(updatedWorkOrder);
      
      await workOrderController.updateWorkOrder(mockRequest, mockResponse);
      
      expect(mockResponse.json).toHaveBeenCalledWith(updatedWorkOrder);
    });
  });

  describe('deleteWorkOrder', () => {
    it('should delete a work order successfully', async () => {
      mockRequest.params.id = 1;
      WorkOrder.delete.mockResolvedValue(true);
      
      await workOrderController.deleteWorkOrder(mockRequest, mockResponse);
      
      expect(WorkOrder.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Work Order deleted successfully' });
    });
  });

  describe('getWorkOrderForDropdown', () => {
    it('should return formatted work orders for dropdown', async () => {
      const mockWorkOrders = [
        { WorkOrderID: 1, Task: 'Task 1', Description: 'Desc 1' },
        { WorkOrderID: 2, Task: 'Task 2', Description: 'Desc 2' }
      ];
      
      WorkOrder.findAll.mockResolvedValue(mockWorkOrders);
      
      await workOrderController.getWorkOrderForDropdown(mockRequest, mockResponse);
      
      expect(WorkOrder.findAll).toHaveBeenCalledWith({
        attributes: ['WorkOrderID', 'Task', 'Description'],
        order: [['Task', 'ASC']]
      });
      
      expect(mockResponse.json).toHaveBeenCalledWith([
        { id: 1, name: 'Task 1 - Desc 1' },
        { id: 2, name: 'Task 2 - Desc 2' }
      ]);
    });
  });

  describe('getWorkOrderByProject', () => {
    it('should return work orders for a specific project', async () => {
      const projectId = 1;
      mockRequest.params.projectId = projectId;
      
      const mockWorkOrders = [
        { WorkOrderID: 1, Task: 'Task 1', ProjectID: projectId },
        { WorkOrderID: 2, Task: 'Task 2', ProjectID: projectId }
      ];
      
      WorkOrder.findAll.mockResolvedValue(mockWorkOrders);
      
      await workOrderController.getWorkOrderByProject(mockRequest, mockResponse);
      
      expect(WorkOrder.findAll).toHaveBeenCalledWith({
        where: { ProjectID: projectId },
        attributes: ['WorkOrderID', 'Task', 'Description', 'ProjectID']
      });
      
      expect(mockResponse.json).toHaveBeenCalledWith(mockWorkOrders);
    });
  });
}); 