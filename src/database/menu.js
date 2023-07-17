const { Menu } = require('./schema');

const createMenu = async (data) => {
    const menu = await Menu.create(data);
    return menu;
};

const findMenuByDate = async (date) => {
    const menu = await Menu.findOne({ date: date });
    return menu;
};

// const findAllMenuByRestaurantId = async (restaurantId) => {
//     const menuList = await Menu.find({ restaurantId: restaurantId });
//     return menuList;
// };

const findAllMenuByDate = async (restaurantId, date) => {
    const menuList = await Menu.find({ restaurantId: restaurantId, date: date });
    return menuList;
};

const updateMenu = async (data) => {
    const menu = await Menu.findByIdAndUpdate({
        _id: data._id
    }, data);
    return menu;
};

const deleteMenu = async (menuId) => {
    await Menu.findByIdAndDelete(menuId);
};

module.exports = {
    createMenu, 
    findMenuByDate,
    findAllMenuByDate,
    updateMenu,
    deleteMenu
};