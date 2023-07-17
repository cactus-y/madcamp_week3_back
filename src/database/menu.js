const { Menu } = require('./schema');

const createMenu = async (data) => {
    const menu = await Menu.create(data);
    return menu;
};

const findMenuById = async (menuId) => {
    const menu = await Menu.findById(menuId);
    return menu;
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
    findMenuById,
    updateMenu,
    deleteMenu
};