const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// GET all clients
router.get('/', clientController.getAllClients);

// GET a single client by ID
router.get('/:id', clientController.getClientById);

// POST a new client
router.post('/', clientController.createClient);

// PUT update an existing client
router.put('/:id', clientController.updateClient);

// DELETE a client
router.delete('/:id', clientController.deleteClient);

router.get('/dropdown/list', clientController.getClientForDropdown);

module.exports = router;
