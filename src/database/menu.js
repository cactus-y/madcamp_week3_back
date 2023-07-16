const { Menu } = require('./schema');

const createMenu = async (data) => {
    const menu = await Menu.create(data);
    return menu;
};

const findMenuWithName = async (menuName) => {
    const menu = await Menu.findOne({ menuName });
    return menu;
};

const findMenuWithId = async (menuId) => {
    const menu = await Menu.findById(menuId);
    return {
        menuId: menu.menuId,
        menuName: menu.menuName,
        price: menu.price
    };
};

module.exports = {
    createMenu,
    findMenuWithName,
    findMenuWithId
};