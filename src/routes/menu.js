const express = require('express');
// menu db functions
const { 
    createMenu, 
    findMenuByDate, 
    updateMenu, 
    deleteMenu 
} = require('../database/menu');

// restaurant db function
const { findRestaurantById, findRestaurantByName } = require('../database/restaurant');

// university db function
const { findUniversityById } = require('../database/university');

// web crawling functions
const { getHyuMenu } = require('../menu/hyu');
const { getSkkuSeoulMenu } = require('../menu/skku_seoul');
const { getKuMenu } = require('../menu/ku');
const { getSkkuSuwonMenu } = require('../menu/skku_suwon');
const { getKaistMenu } = require('../menu/kaist');
const { getPostechMenu } = require('../menu/postech');

const router = express.Router();
require('dotenv').config();

router.get('/list', async (req, res) => {
    try {
        let menuList;
        // get current date
        const today = new Date();
        const currentYear = today.getFullYear().toString();
        const hyuMonth = today.getMonth();
        const currentMonth = today.getMonth() + 1;
        const currentDate = today.getDate();

        let hyuMonthParam, curMonthParam, curDateParam;


        if(hyuMonth < 10)
            hyuMonthParam = '0' + hyuMonth;
        else
            hyuMonthParam = hyuMonth.toString();
        
        if(currentMonth < 10)
            curMonthParam = '0' + currentMonth;
        else 
            curMonthParam = currentMonth.toString();

        if(currentDate < 10)
            curDateParam = '0' + currentDate;
        else 
            curDateParam = currentDate.toString();
        
        const dateString = currentYear + '.' + curMonthParam + '.' + curDateParam;

        menuList = await findMenuByDate(req.query.restaurantId, dateString);
        if(!menuList) {
            // get all menu data by using web crawling
            const targetRestaurant = await findRestaurantById(req.query.restaurantId);
            if(targetRestaurant) {
                const targetUniversity = await findUniversityById(targetRestaurant.universityId);
                if(targetUniversity) {
                    if(targetUniversity.universityName === '한양대학교') {
                        const menu = await getHyuMenu(currentYear, hyuMonthParam, curDateParam);
                        for(let i = 0; i < menu.length; i++) {
                            const restaurant = await findRestaurantByName(targetUniversity._id, menu[i].restaurantName);
                            const newMenu = await createMenu({
                                restaurantId: restaurant._id,
                                date: menu[i].date,
                                breakfast: menu[i].breakfast,
                                lunch: menu[i].lunch,
                                dinner: menu[i].dinner
                            });
                            if(req.query.restaurantId === newMenu.restaurantId.toString()) 
                                // menuList.push(newMenu);
                                menuList = newMenu
                        }
                    } else if(targetUniversity.universityName === '성균관대학교_서울캠퍼스') {
                        const menu = await getSkkuSeoulMenu(currentYear, curMonthParam, curDateParam);
                        for(let i = 0; i < menu.length; i++) {
                            const restaurant = await findRestaurantByName(targetUniversity._id, menu[i].restaurantName);
                            const newMenu = await createMenu({
                                restaurantId: restaurant._id,
                                date: menu[i].date,
                                breakfast: menu[i].breakfast,
                                lunch: menu[i].lunch,
                                dinner: menu[i].dinner
                            });
                            if(req.query.restaurantId === newMenu.restaurantId.toString()) 
                                // menuList.push(newMenu);
                                menuList = newMenu;
                        }
                    } else if(targetUniversity.universityName === '고려대학교') {
                        // ku receives whole week's menu. code is slightly different.
                        const menu = await getKuMenu(currentYear, curMonthParam, curDateParam);
                        for(let i = 0; i < menu.length; i++) {
                            const restaurant = await findRestaurantByName(targetUniversity._id, menu[i].restaurantName);
                            const newMenu = await createMenu({
                                restaurantId: restaurant._id,
                                date: menu[i].date,
                                breakfast: menu[i].breakfast,
                                lunch: menu[i].lunch,
                                dinner: menu[i].dinner
                            });
                            if(req.query.restaurantId === newMenu.restaurantId.toString() && newMenu.date === dateString) 
                                // menuList.push(newMenu);
                                menuList = newMenu;
                        }
                    } else if(targetUniversity.universityName === '성균관대학교_수원캠퍼스') {
                        const menu = await getSkkuSuwonMenu(currentYear, curMonthParam, curDateParam);
                        for(let i = 0; i < menu.length; i++) {
                            const restaurant = await findRestaurantByName(targetUniversity._id, menu[i].restaurantName);
                            const newMenu = await createMenu({
                                restaurantId: restaurant._id,
                                date: menu[i].date,
                                breakfast: menu[i].breakfast,
                                lunch: menu[i].lunch,
                                dinner: menu[i].dinner
                            });
                            if(req.query.restaurantId === newMenu.restaurantId.toString()) 
                                // menuList.push(newMenu);
                                menuList = newMenu;
                        }
                    } else if(targetUniversity.universityName === '카이스트') {
                        const menu = await getKaistMenu(currentYear, curMonthParam, curDateParam);
                        for(let i = 0; i < menu.length; i++) {
                            const restaurant = await findRestaurantByName(targetUniversity._id, menu[i].restaurantName);
                            const newMenu = await createMenu({
                                restaurantId: restaurant._id,
                                date: menu[i].date,
                                breakfast: menu[i].breakfast,
                                lunch: menu[i].lunch,
                                dinner: menu[i].dinner
                            });
                            if(req.query.restaurantId === newMenu.restaurantId.toString()) 
                                // menuList.push(newMenu);
                                menuList = newMenu;
                        }
                    } else if(targetUniversity.universityName === '포항공과대학교') {
                        const menu = await getPostechMenu(currentYear, curMonthParam, curDateParam);
                        for(let i = 0; i < menu.length; i++) {
                            const restaurant = await findRestaurantByName(targetUniversity._id, menu[i].restaurantName);
                            const newMenu = await createMenu({
                                restaurantId: restaurant._id,
                                date: menu[i].date,
                                breakfast: menu[i].breakfast,
                                lunch: menu[i].lunch,
                                dinner: menu[i].dinner
                            });
                            if(req.query.restaurantId === newMenu.restaurantId.toString()) 
                                // menuList.push(newMenu);
                                menuList = newMenu;
                        }
                    } else {
                        return res.status(404).json({
                            success: false,
                            message: '해당 대학이 존재하지 않습니다.'
                        });
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

// router.get('/', async (req, res) => {
//     try {
        
//     } catch(err) {
//         console.log(err);
//         res.status(400).json({
//             success: false,
//             err
//         });
//     }
// });

router.patch('/:menuId', async (req, res) => {
    try {
        const exist = await findRestaurantById(req.params.menuId);
        if(!exist) {
            return res.status(404).json({
                success: false,
                message: '해당 메뉴가 존재하지 않습니다.'
            });
        }

        const updatedMenu = await updateMenu({
            menuId: req.params.menuId,
            restaurantId: req.body.restaurantId,
            date: req.body.date,
            breakfast: req.body.breakfast,
            lunch: req.body.lunch,
            dinner: req.body.dinner
        });

        res.status(200).json({
            success: true,
            menu: updatedMenu
        });
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
        const exist = await findRestaurantById(req.params.menuId);
        if(!exist) {
            return res.status(404).json({
                success: false,
                message: '해당 메뉴가 존재하지 않습니다.'
            });
        }

        await deleteMenu(req.params.menuId);

        return res.status(204).json({
            success: true,
            message: '성공적으로 메뉴를 삭제했습니다.'
        });
    } catch(err) {
        console.log(err);
        res.status(400).json({
            success: false,
            err
        });
    }
});

module.exports = router;