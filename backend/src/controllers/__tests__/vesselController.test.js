const { getAllVessels, getVesselById, createVessel, updateVessel, deleteVessel, getVesselForDropdown, getVesselByClient } = require('../vesselController');
const Vessel = require('../../models/Vessel');

// Mock the Vessel model
jest.mock('../../models/Vessel');

describe('Vessel Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup request and response objects
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

  describe('getAllVessels', () => {
    it('should return all vessels successfully', async () => {
      const mockVessels = [
        { VesselID: 1, Name: 'Vessel 1' },
        { VesselID: 2, Name: 'Vessel 2' }
      ];
      Vessel.findAll.mockResolvedValue(mockVessels);

      await getAllVessels(mockReq, mockRes);

      expect(Vessel.findAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockVessels);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      Vessel.findAll.mockRejectedValue(error);

      await getAllVessels(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching vessels',
        error: error.message
      });
    });
  });

  describe('getVesselById', () => {
    it('should return a vessel when found', async () => {
      const mockVessel = { VesselID: 1, Name: 'Vessel 1' };
      mockReq.params.id = 1;
      Vessel.findByPk.mockResolvedValue(mockVessel);

      await getVesselById(mockReq, mockRes);

      expect(Vessel.findByPk).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockVessel);
    });

    it('should return 404 when vessel not found', async () => {
      mockReq.params.id = 999;
      Vessel.findByPk.mockResolvedValue(null);

      await getVesselById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Vessel not found' });
    });
  });

  describe('createVessel', () => {
    it('should create a vessel successfully', async () => {
      const mockNewVessel = { VesselID: 1, Name: 'New Vessel' };
      mockReq.body = { Name: 'New Vessel' };
      Vessel.create.mockResolvedValue(mockNewVessel);

      await createVessel(mockReq, mockRes);

      expect(Vessel.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockNewVessel);
    });
  });

  describe('updateVessel', () => {
    it('should update a vessel successfully', async () => {
      const mockUpdatedVessel = { VesselID: 1, Name: 'Updated Vessel' };
      mockReq.params.id = 1;
      mockReq.body = { Name: 'Updated Vessel' };
      Vessel.update.mockResolvedValue([1]);
      Vessel.findByPk.mockResolvedValue(mockUpdatedVessel);

      await updateVessel(mockReq, mockRes);

      expect(Vessel.update).toHaveBeenCalledWith(mockReq.body, {
        where: { VesselID: 1 }
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedVessel);
    });
  });

  describe('deleteVessel', () => {
    it('should delete a vessel successfully', async () => {
      mockReq.params.id = 1;
      Vessel.destroy.mockResolvedValue(1);

      await deleteVessel(mockReq, mockRes);

      expect(Vessel.destroy).toHaveBeenCalledWith({
        where: { VesselID: 1 }
      });
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

  describe('getVesselForDropdown', () => {
    it('should return formatted vessels for dropdown', async () => {
      const mockVessels = [
        { VesselID: 1, Name: 'Vessel 1' },
        { VesselID: 2, Name: 'Vessel 2' }
      ];
      const expectedResponse = [
        { id: 1, name: 'Vessel 1' },
        { id: 2, name: 'Vessel 2' }
      ];
      Vessel.findAll.mockResolvedValue(mockVessels);

      await getVesselForDropdown(mockReq, mockRes);

      expect(Vessel.findAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('getVesselByClient', () => {
    it('should return vessels for a specific client', async () => {
      const mockVessels = [
        { VesselID: 1, Name: 'Vessel 1' },
        { VesselID: 2, Name: 'Vessel 2' }
      ];
      const mockClientID = 1;
      Vessel.findAll.mockResolvedValue(mockVessels);

      await getVesselByClient(mockReq, mockRes);

      expect(Vessel.findAll).toHaveBeenCalledWith({
        where: { ClientID: mockClientID }
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockVessels);
    });
  });
}); 