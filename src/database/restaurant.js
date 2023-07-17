const { Restaurant } = require('./schema');

const createRestaurant = async (data) => {
    const restaurant = await Restaurant.create(data);
    return restaurant;
};

const findRestaurantById = async (restaurantId) => {
    const restaurant = await Restaurant.findById(restaurantId);
    return restaurant;
};

const deleteRestaurant = async (restaurantId) => {
    await Restaurant.findByIdAndDelete(restaurantId);
};

module.exports = {
    createRestaurant,
    findRestaurantById,
    deleteRestaurant
};