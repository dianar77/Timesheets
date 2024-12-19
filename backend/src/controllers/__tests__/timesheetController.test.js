const { 
  getAllTimesheets, 
  getTimesheetById, 
  createTimesheet, 
  updateTimesheet, 
  deleteTimesheet,
  getTimesheetForDropdown,
  getTimesheetByStaff,
  getTimesheetByWorkOrder
} = require('../timesheetController');
const Timesheet = require('../../models/Timesheet');
const moment = require('moment');

// Mock the Timesheet model
jest.mock('../../models/Timesheet');

describe('Timesheet Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock request and response
    mockReq = {
      params: {},
      body: {}
    };
    
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  describe('getAllTimesheets', () => {
    it('should return all timesheets', async () => {
      const mockTimesheets = [
        { TimesheetID: 1, StaffID: 1, WorkOrderID: 1 },
        { TimesheetID: 2, StaffID: 2, WorkOrderID: 2 }
      ];
      
      Timesheet.findAll.mockResolvedValue(mockTimesheets);
      
      await getAllTimesheets(mockReq, mockRes);
      
      expect(Timesheet.findAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockTimesheets);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      Timesheet.findAll.mockRejectedValue(error);
      
      await getAllTimesheets(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching timesheets',
        error: error.message
      });
    });
  });

  describe('getTimesheetById', () => {
    it('should return timesheet by id', async () => {
      const mockTimesheet = { TimesheetID: 1, StaffID: 1, WorkOrderID: 1 };
      mockReq.params.id = 1;
      
      Timesheet.findByPk.mockResolvedValue(mockTimesheet);
      
      await getTimesheetById(mockReq, mockRes);
      
      expect(Timesheet.findByPk).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockTimesheet);
    });

    it('should return 404 if timesheet not found', async () => {
      mockReq.params.id = 999;
      Timesheet.findByPk.mockResolvedValue(null);
      
      await getTimesheetById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Timesheet not found' });
    });
  });

  describe('createTimesheet', () => {
    it('should create new timesheet', async () => {
      const mockTimesheet = { 
        StaffID: 1, 
        WorkOrderID: 1, 
        Hours: 8, 
        Date: '2024-03-20' 
      };
      mockReq.body = mockTimesheet;
      
      Timesheet.create.mockResolvedValue({ ...mockTimesheet, TimesheetID: 1 });
      
      await createTimesheet(mockReq, mockRes);
      
      expect(Timesheet.create).toHaveBeenCalledWith(mockTimesheet);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateTimesheet', () => {
    it('should update timesheet successfully', async () => {
      mockReq.params.id = 1;
      mockReq.body = {
        StaffID: '1',
        WorkOrderID: '1',
        Hours: '8',
        Date: '2024-03-20'
      };

      Timesheet.update.mockResolvedValue([1]);
      Timesheet.findByPk.mockResolvedValue({ ...mockReq.body, TimesheetID: 1 });

      await updateTimesheet(mockReq, mockRes);

      expect(Timesheet.update).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should return 404 if timesheet not found during update', async () => {
      mockReq.params.id = 999;
      mockReq.body = {
        StaffID: '1',
        WorkOrderID: '1',
        Hours: '8'
      };

      Timesheet.update.mockResolvedValue([0]);

      await updateTimesheet(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteTimesheet', () => {
    it('should delete timesheet successfully', async () => {
      mockReq.params.id = 1;
      Timesheet.destroy.mockResolvedValue(1);

      await deleteTimesheet(mockReq, mockRes);

      expect(Timesheet.destroy).toHaveBeenCalledWith({
        where: { TimesheetID: 1 }
      });
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 if timesheet not found for deletion', async () => {
      mockReq.params.id = 999;
      Timesheet.destroy.mockResolvedValue(0);

      await deleteTimesheet(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getTimesheetForDropdown', () => {
    it('should return formatted timesheets for dropdown', async () => {
      const mockTimesheets = [
        { TimesheetID: 1, StaffID: 1, Date: '2024-03-20' },
        { TimesheetID: 2, StaffID: 2, Date: '2024-03-21' }
      ];

      Timesheet.findAll.mockResolvedValue(mockTimesheets);

      await getTimesheetForDropdown(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith([
        { id: 1, name: '1 - 2024-03-20' },
        { id: 2, name: '2 - 2024-03-21' }
      ]);
    });
  });

  describe('getTimesheetByStaff', () => {
    it('should return timesheets for specific staff', async () => {
      mockReq.params.staffId = 1;
      const mockTimesheets = [
        { TimesheetID: 1, StaffID: 1, WorkOrderID: 1 }
      ];

      Timesheet.findAll.mockResolvedValue(mockTimesheets);

      await getTimesheetByStaff(mockReq, mockRes);

      expect(Timesheet.findAll).toHaveBeenCalledWith({
        where: { StaffID: 1 },
        attributes: ['TimesheetID', 'StaffID', 'WorkOrderID', 'Date', 'Hours']
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockTimesheets);
    });
  });

  describe('getTimesheetByWorkOrder', () => {
    it('should return timesheets for specific work order', async () => {
      mockReq.params.workorderId = 1;
      const mockTimesheets = [
        { TimesheetID: 1, StaffID: 1, WorkOrderID: 1 }
      ];

      Timesheet.findAll.mockResolvedValue(mockTimesheets);

      await getTimesheetByWorkOrder(mockReq, mockRes);

      expect(Timesheet.findAll).toHaveBeenCalledWith({
        where: { WorkOrderID: 1 },
        attributes: ['TimesheetID', 'StaffID', 'WorkOrderID', 'Date', 'Hours']
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockTimesheets);
    });
  });
}); 