const express = require('express');
const { createRestaurant, findRestaurantById, deleteRestaurant } = require('../database/restaurant');
const router = express.Router();
require('dotenv').config();



module.exports = router;