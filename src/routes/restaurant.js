const express = require('express');
const { createRestaurant, findRestaurantById, findRestaurantByName, findAllRestaurantByUniversityId, deleteRestaurant } = require('../database/restaurant');
const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const restaurant = await findRestaurantById(req.query.restaurantId);
        if(!restaurant) {
            return res.status(404).json({
                success: false,
                invalidRestaurant: true,
                message: '존재하지 않는 식당입니다.'
            });
        }

        return res.status(200).json({
            success: true,
            restaurant: restaurant
        });
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            err
        });
    }
});


router.get('/list', async (req, res) => {
    try {
        const restaurantList = await findAllRestaurantByUniversityId(req.query.universityId);
        return res.status(200).json({
            success: true,
            restaurantList: restaurantList
        });
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            err
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const exist = await findRestaurantByName(req.body.restaurantName);
        if(exist) {
            if(exist.universityId === req.body.universityId) {
                return res.status(400).json({
                    success: false,
                    message: '해당 식당이 이미 존재합니다.'
                });
            }
            
        }

        const newRestaurant = await createRestaurant({
            universityId: req.body.universityId,
            restaurantName: req.body.restaurantName,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        return res.status(201).json({
            success: true,
            restaurant: newRestaurant
        });
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            err
        });
    }
});

router.delete('/:restaurantId', async (req, res) => {
    try {
        const exist = await findRestaurantById(req.params.restaurantId);

        if(!exist) {
            return res.status(404).json({
                success: false,
                message: '식당이 존재하지 않습니다.'
            });
        }

        await deleteRestaurant(req.params.restaurantId);

        return res.status(204).json({
            success: true,
            message: '성공적으로 식당을 삭제했습니다.'
        });
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            err
        });
    }
});



module.exports = router;