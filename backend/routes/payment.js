const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

router.post('/webhook', stripeController.handleWebhook);

module.exports = router;
