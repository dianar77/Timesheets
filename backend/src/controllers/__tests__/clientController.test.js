const Client = require('../../models/Client');
const clientController = require('../clientController');

// Mock the Client model
jest.mock('../models/Client');

describe('Client Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      params: { id: '1' },
      body: { Name: 'Test Client' }
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  describe('getAllClients', () => {
    it('should return all clients successfully', async () => {
      const mockClients = [{ id: 1, Name: 'Client 1' }, { id: 2, Name: 'Client 2' }];
      Client.findAll.mockResolvedValue(mockClients);

      await clientController.getAllClients(req, res);

      expect(Client.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockClients);
    });

    it('should handle errors when fetching clients', async () => {
      const error = new Error('Database error');
      Client.findAll.mockRejectedValue(error);

      await clientController.getAllClients(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching clients',
        error: error.message
      });
    });
  });

  describe('getClientById', () => {
    it('should return client when found', async () => {
      const mockClient = { id: 1, Name: 'Test Client' };
      Client.findByPk.mockResolvedValue(mockClient);

      await clientController.getClientById(req, res);

      expect(Client.findByPk).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockClient);
    });

    it('should return 404 when client not found', async () => {
      Client.findByPk.mockResolvedValue(null);

      await clientController.getClientById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Client not found' });
    });
  });

  describe('createClient', () => {
    it('should create client successfully', async () => {
      const mockClient = { id: 1, Name: 'Test Client' };
      Client.create.mockResolvedValue(mockClient);

      await clientController.createClient(req, res);

      expect(Client.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockClient);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Validation error');
      Client.create.mockRejectedValue(error);

      await clientController.createClient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating client',
        error: error.message
      });
    });
  });

  describe('updateClient', () => {
    it('should update client successfully', async () => {
      const mockUpdatedClient = { id: 1, Name: 'Updated Client' };
      Client.update.mockResolvedValue([1]);
      Client.findByPk.mockResolvedValue(mockUpdatedClient);

      await clientController.updateClient(req, res);

      expect(Client.update).toHaveBeenCalledWith(req.body, {
        where: { ClientID: '1' }
      });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedClient);
    });

    it('should return 404 when client not found', async () => {
      Client.update.mockResolvedValue([0]);

      await clientController.updateClient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Client not found' });
    });
  });

  describe('deleteClient', () => {
    it('should delete client successfully', async () => {
      Client.destroy.mockResolvedValue(1);

      await clientController.deleteClient(req, res);

      expect(Client.destroy).toHaveBeenCalledWith({
        where: { ClientID: '1' }
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 when client not found', async () => {
      Client.destroy.mockResolvedValue(0);

      await clientController.deleteClient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Client not found' });
    });
  });

  describe('getClientForDropdown', () => {
    it('should return formatted clients for dropdown', async () => {
      const mockClients = [
        { ClientID: 1, Name: 'Client 1' },
        { ClientID: 2, Name: 'Client 2' }
      ];
      const expectedResponse = [
        { id: 1, name: 'Client 1' },
        { id: 2, name: 'Client 2' }
      ];
      
      Client.findAll.mockResolvedValue(mockClients);

      await clientController.getClientForDropdown(req, res);

      expect(Client.findAll).toHaveBeenCalledWith({
        attributes: ['ClientID', 'Name'],
        order: [['Name', 'ASC']]
      });
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should handle errors when fetching dropdown data', async () => {
      const error = new Error('Database error');
      Client.findAll.mockRejectedValue(error);

      await clientController.getClientForDropdown(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching clients for dropdown',
        error: error.message
      });
    });
  });
}); 