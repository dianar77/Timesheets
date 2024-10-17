const express = require('express');
const router = express.Router();
const vesselController = require('../controllers/vesselController');

router.get('/', vesselController.getAllVessels);
router.get('/:id', vesselController.getVesselById);
router.post('/', vesselController.createVessel);
router.put('/:id', vesselController.updateVessel);
router.delete('/:id', vesselController.deleteVessel);

module.exports = router;
