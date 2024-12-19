const Staff = require('../../models/staff');
const staffController = require('../staffController');

// Mock the Staff model
jest.mock('../models/staff');

describe('Staff Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('getAllStaff', () => {
    it('should fetch all staff successfully', async () => {
      const mockStaff = [
        { StaffID: 1, Name: 'John Doe' },
        { StaffID: 2, Name: 'Jane Smith' }
      ];
      Staff.findAll.mockResolvedValue(mockStaff);

      await staffController.getAllStaff(req, res);

      expect(Staff.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockStaff);
    });

    it('should handle errors when fetching staff', async () => {
      const error = new Error('Database error');
      Staff.findAll.mockRejectedValue(error);

      await staffController.getAllStaff(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching staff',
        error: error.message
      });
    });
  });

  describe('getStaffById', () => {
    it('should fetch staff by id successfully', async () => {
      const mockStaff = { StaffID: 1, Name: 'John Doe' };
      Staff.findByPk.mockResolvedValue(mockStaff);
      req.params.id = 1;

      await staffController.getStaffById(req, res);

      expect(Staff.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockStaff);
    });

    it('should return 404 when staff not found', async () => {
      Staff.findByPk.mockResolvedValue(null);
      req.params.id = 999;

      await staffController.getStaffById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Staff not found' });
    });
  });

  describe('createStaff', () => {
    it('should create staff successfully', async () => {
      const mockNewStaff = { StaffID: 1, Name: 'John Doe' };
      req.body = { Name: 'John Doe' };
      Staff.create.mockResolvedValue(mockNewStaff);

      await staffController.createStaff(req, res);

      expect(Staff.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNewStaff);
    });
  });

  describe('updateStaff', () => {
    it('should update staff successfully', async () => {
      const mockUpdatedStaff = { StaffID: 1, Name: 'John Updated' };
      req.params.id = 1;
      req.body = { Name: 'John Updated' };
      Staff.update.mockResolvedValue([1]);
      Staff.findByPk.mockResolvedValue(mockUpdatedStaff);

      await staffController.updateStaff(req, res);

      expect(Staff.update).toHaveBeenCalledWith(req.body, {
        where: { StaffID: 1 }
      });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedStaff);
    });

    it('should return 404 when staff to update not found', async () => {
      req.params.id = 999;
      Staff.update.mockResolvedValue([0]);

      await staffController.updateStaff(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Staff not found' });
    });
  });

  describe('deleteStaff', () => {
    it('should delete staff successfully', async () => {
      req.params.id = 1;
      Staff.destroy.mockResolvedValue(1);

      await staffController.deleteStaff(req, res);

      expect(Staff.destroy).toHaveBeenCalledWith({
        where: { StaffID: 1 }
      });
      expect(res.json).toHaveBeenCalledWith({ message: 'Staff deleted successfully' });
    });

    it('should return 404 when staff to delete not found', async () => {
      req.params.id = 999;
      Staff.destroy.mockResolvedValue(0);

      await staffController.deleteStaff(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Staff not found' });
    });
  });

  describe('getStaffForDropdown', () => {
    it('should fetch staff for dropdown successfully', async () => {
      const mockStaff = [
        { StaffID: 1, Name: 'John Doe' },
        { StaffID: 2, Name: 'Jane Smith' }
      ];
      Staff.findAll.mockResolvedValue(mockStaff);

      await staffController.getStaffForDropdown(req, res);

      expect(Staff.findAll).toHaveBeenCalledWith({
        attributes: ['StaffID', 'Name'],
        order: [['Name', 'ASC']]
      });
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ]);
    });
  });

  describe('getStaffByDiscipline', () => {
    it('should fetch staff by discipline successfully', async () => {
      const mockStaff = [
        { StaffID: 1, Name: 'John Doe', PersonalID: 'P1', DisciplineID: 1 }
      ];
      req.params.disciplineId = 1;
      Staff.findAll.mockResolvedValue(mockStaff);

      await staffController.getStaffByDiscipline(req, res);

      expect(Staff.findAll).toHaveBeenCalledWith({
        where: { DisciplineID: 1 },
        attributes: ['StaffID', 'Name', 'PersonalID', 'DisciplineID']
      });
      expect(res.json).toHaveBeenCalledWith(mockStaff);
    });
  });
}); 