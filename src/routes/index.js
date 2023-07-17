const express = require('express');
const router = express.Router();

const university = require('./university');
const restaurant = require('./restaurant');
const menu = require('./menu');

router.use('/university', university);
router.use('/restaurant', restaurant);
router.use('/menu', menu);

module.exports = router;