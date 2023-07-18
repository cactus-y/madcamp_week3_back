const express = require('express');
const { createUniversity, findUniversityByName, findUniversityById, findAllUniversity } = require('../database/university');
const router = express.Router();
require('dotenv').config();

router.get('/', async (req, res) => {
    try {
        const university = await findUniversityByName(req.query.universityName);
        if(!university) {
            return res.status(404).json({
                success: false,
                invalidUniversity: true,
                message: '존재하지 않는 대학입니다.'
            });
        }

        return res.status(200).json({
            success: true,
            university: university
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
        const universityList = await findAllUniversity();
        return res.status(200).json({
            success: true,
            universityList: universityList
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
        const exist = await findUniversityByName(req.body.universityName);
        if(exist) {
            return res.status(400).json({
                success: false,
                message: '해당 대학이 이미 존재합니다.'
            });
        }
        const newUniversity = await createUniversity({
            universityName: req.body.universityName,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });
        return res.status(201).json({
            success: true,
            university: newUniversity
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