const { 
  getAllDisciplines, 
  getDisciplineById, 
  createDiscipline, 
  updateDiscipline, 
  deleteDiscipline,
  getDisciplinesForDropdown 
} = require('../disciplineController');
const Discipline = require('../../models/Discipline');

// Mock the Discipline model
jest.mock('../../models/Discipline');

describe('Discipline Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup request and response objects
    mockReq = {
      params: { id: '1' },
      body: { Name: 'Test Discipline' }
    };
    
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('getAllDisciplines', () => {
    it('should return all disciplines', async () => {
      const mockDisciplines = [
        { DisciplineID: 1, Name: 'Discipline 1' },
        { DisciplineID: 2, Name: 'Discipline 2' }
      ];
      Discipline.findAll.mockResolvedValue(mockDisciplines);

      await getAllDisciplines(mockReq, mockRes);

      expect(Discipline.findAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockDisciplines);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      Discipline.findAll.mockRejectedValue(error);

      await getAllDisciplines(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching disciplines',
        error: error.message
      });
    });
  });

  describe('getDisciplineById', () => {
    it('should return discipline when found', async () => {
      const mockDiscipline = { DisciplineID: 1, Name: 'Test Discipline' };
      Discipline.findByPk.mockResolvedValue(mockDiscipline);

      await getDisciplineById(mockReq, mockRes);

      expect(Discipline.findByPk).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockDiscipline);
    });

    it('should return 404 when discipline not found', async () => {
      Discipline.findByPk.mockResolvedValue(null);

      await getDisciplineById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Discipline not found' });
    });
  });

  describe('createDiscipline', () => {
    it('should create and return new discipline', async () => {
      const mockNewDiscipline = { DisciplineID: 1, Name: 'Test Discipline' };
      Discipline.create.mockResolvedValue(mockNewDiscipline);

      await createDiscipline(mockReq, mockRes);

      expect(Discipline.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockNewDiscipline);
    });
  });

  describe('updateDiscipline', () => {
    it('should update and return discipline when found', async () => {
      const mockUpdatedDiscipline = { DisciplineID: 1, Name: 'Updated Discipline' };
      Discipline.update.mockResolvedValue([1]);
      Discipline.findByPk.mockResolvedValue(mockUpdatedDiscipline);

      await updateDiscipline(mockReq, mockRes);

      expect(Discipline.update).toHaveBeenCalledWith(
        mockReq.body,
        { where: { DisciplineID: '1' } }
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedDiscipline);
    });

    it('should return 404 when discipline not found', async () => {
      Discipline.update.mockResolvedValue([0]);

      await updateDiscipline(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Discipline not found' });
    });
  });

  describe('deleteDiscipline', () => {
    it('should delete and return success message when found', async () => {
      Discipline.destroy.mockResolvedValue(1);

      await deleteDiscipline(mockReq, mockRes);

      expect(Discipline.destroy).toHaveBeenCalledWith({
        where: { DisciplineID: '1' }
      });
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Discipline deleted successfully' });
    });

    it('should return 404 when discipline not found', async () => {
      Discipline.destroy.mockResolvedValue(0);

      await deleteDiscipline(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Discipline not found' });
    });
  });

  describe('getDisciplinesForDropdown', () => {
    it('should return formatted disciplines for dropdown', async () => {
      const mockDisciplines = [
        { DisciplineID: 1, Name: 'Discipline 1' },
        { DisciplineID: 2, Name: 'Discipline 2' }
      ];
      const expectedResponse = [
        { id: 1, name: 'Discipline 1' },
        { id: 2, name: 'Discipline 2' }
      ];
      
      Discipline.findAll.mockResolvedValue(mockDisciplines);

      await getDisciplinesForDropdown(mockReq, mockRes);

      expect(Discipline.findAll).toHaveBeenCalledWith({
        attributes: ['DisciplineID', 'Name'],
        order: [['Name', 'ASC']]
      });
      expect(mockRes.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
}); 