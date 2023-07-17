const express = require('express');
const { createMenu, findMenuWithName, findMenuWithId } = require('../database/menu');
const router = express.Router();
require('dotenv').config();

router.get('/', async(req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        res.status(400).json({
            success: false
        });
    }
});

module.exports = router;