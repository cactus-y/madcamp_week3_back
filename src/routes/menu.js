const express = require('express');
// menu db functions
const { 
    createMenu, 
    findMenuByDate, 
    findAllMenuByDate, 
    updateMenu, 
    deleteMenu 
} = require('../database/menu');

// restaurant db function
const { findRestaurantById } = require('../database/restaurant');

// university db function
const { findUniversityById } = require('../database/university');

// web crawling functions
const { getHyuMenu } = require('../menu/hyu');
const { getSkkuSeoulMenu } = require('../menu/skku_seoul');
const { getKuMenu } = require('../menu/ku');
const { getSkkuSuwonMenu } = require('../menu/skku_suwon');

const router = express.Router();
require('dotenv').config();

router.get('/list', async (req, res) => {
    try {
        const menuList = await findAllMenuByDate(req.query.restaurantId, req.query.date);
        if(menuList.length === 0) {
            // get current date
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth(); // Jan is 0
            const currentDate = today.getDate();

            // get data by using web crawling
            const targetRestaurant = await findRestaurantById(req.query.restaurantId);
            if(targetRestaurant) {
                const targetUniversity = await findUniversityById(targetRestaurant.universityId);
                if(targetUniversity) {
                    if(targetUniversity.universityName === '한양대학교') {
                        const menu = getHyuMenu(currentYear, currentMonth, currentDate);
                    } else if(targetUniversity.universityName === '성균관대학교_서울캠퍼스') {
                        const menu = getSkkuSeoulMenu(currentYear, currentMonth + 1, currentDate);
                    } else if(targetUniversity.universityName === '고려대학교') {
                        const menu = getKuMenu(currentYear, currentMonth + 1, currentDate);
                    }
                } else {
                    // could not find the university
                    return res.status(404).json({
                        success: false,
                        message: '해당 대학이 존재하지 않습니다.'
                    });
                }
            } else {
                // could not find the restaurant
                return res.status(404).json({
                    success: false,
                    message: '해당 식당이 존재하지 않습니다.'
                });
            }
        }
        return res.status(200).json({
            success: true,
            menuList: menuList
        })
    } catch(err) {
        console.log(err);
        res.status(400).json({
            success: false,
            err
        });
    }
});

router.get('/', async (req, res) => {
    try {

    } catch(err) {
        console.log(err);
        res.status(400).json({
            success: false,
            err
        });
    }
});

router.patch('/:menuId', async (req, res) => {
    try {

    } catch(err) {
        console.log(err);
        res.status(400).json({
            success: false,
            err
        });
    }
});

router.delete('/:menuId', async (req, res) => {
    try {
        
    } catch(err) {
        console.log(err);
        res.status(400).json({
            success: false,
            err
        });
    }
});

module.exports = router;