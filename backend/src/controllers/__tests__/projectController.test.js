const Project = require('../../models/Project');
const projectController = require('../projectController');

// Mock the Project model
jest.mock('../../models/Project');

// Mock request and response
let req;
let res;

beforeEach(() => {
  // Reset mocks before each test
  jest.clearAllMocks();
  
  // Setup req and res mocks
  req = {
    params: {},
    body: {}
  };
  res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };
});

describe('Project Controller', () => {
  describe('getAllProjects', () => {
    it('should return all projects successfully', async () => {
      const mockProjects = [
        { ProjectID: 1, Name: 'Project 1' },
        { ProjectID: 2, Name: 'Project 2' }
      ];
      Project.findAll.mockResolvedValue(mockProjects);

      await projectController.getAllProjects(req, res);

      expect(Project.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockProjects);
    });

    it('should handle errors when fetching all projects', async () => {
      const error = new Error('Database error');
      Project.findAll.mockRejectedValue(error);

      await projectController.getAllProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching projects',
        error: error.message
      });
    });
  });

  describe('getProjectById', () => {
    it('should return a project when found', async () => {
      const mockProject = { ProjectID: 1, Name: 'Project 1' };
      Project.findByPk.mockResolvedValue(mockProject);
      req.params.id = 1;

      await projectController.getProjectById(req, res);

      expect(Project.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it('should return 404 when project not found', async () => {
      Project.findByPk.mockResolvedValue(null);
      req.params.id = 999;

      await projectController.getProjectById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const mockProject = { ProjectID: 1, Name: 'New Project' };
      const mockCreatedProject = { ...mockProject };
      req.body = mockProject;
      
      Project.prototype.create = jest.fn().mockResolvedValue(mockCreatedProject);

      await projectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedProject);
    });
  });

  describe('getProjectForDropdown', () => {
    it('should return formatted projects for dropdown', async () => {
      const mockProjects = [
        { ProjectID: 1, Name: 'Project 1' },
        { ProjectID: 2, Name: 'Project 2' }
      ];
      const expectedResponse = [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' }
      ];
      
      Project.findAll.mockResolvedValue(mockProjects);

      await projectController.getProjectForDropdown(req, res);

      expect(Project.findAll).toHaveBeenCalledWith({
        attributes: ['ProjectID', 'Name'],
        order: [['Name', 'ASC']]
      });
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('getProjectByVessel', () => {
    it('should return projects for a specific vessel', async () => {
      const mockProjects = [
        { ProjectID: 1, Name: 'Project 1', VesselID: 123 }
      ];
      req.params.vesselId = 123;
      
      Project.findAll.mockResolvedValue(mockProjects);

      await projectController.getProjectByVessel(req, res);

      expect(Project.findAll).toHaveBeenCalledWith({
        where: { VesselID: 123 },
        attributes: ['ProjectID', 'Name', 'Num', 'VesselID']
      });
      expect(res.json).toHaveBeenCalledWith(mockProjects);
    });
  });
}); 