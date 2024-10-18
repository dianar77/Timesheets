const Client = require('../models/Client');

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client', error: error.message });
  }
};

exports.createClient = async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(400).json({ message: 'Error creating client', error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const [updated] = await Client.update(req.body, {
      where: { ClientID: req.params.id }
    });
    if (updated) {
      const updatedClient = await Client.findByPk(req.params.id);
      res.json(updatedClient);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(400).json({ message: 'Error updating client', error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const deleted = await Client.destroy({
      where: { ClientID: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
};

exports.getClientForDropdown = async (req, res) => {
    try {
      const clients = await Client.findAll({
        attributes: ['ClientID', 'Name'],
        order: [['Name', 'ASC']]
      });
      
      const formattedclients = clients.map(d => ({
        id: d.ClientID,
        name: d.Name
      }));
      
      res.json(formattedclients);
    } catch (error) {
      console.error('Error fetching clients for dropdown:', error);
      res.status(500).json({ message: 'Error fetching clients for dropdown', error: error.message });
    }
  };
