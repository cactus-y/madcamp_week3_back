const { Restaurant } = require('./schema');

const createRestaurant = async (data) => {
    const restaurant = await Restaurant.create(data);
    return restaurant;
};

const findRestaurantById = async (restaurantId) => {
    const restaurant = await Restaurant.findById(restaurantId);
    return restaurant;
};

const findRestaurantByName = async (universityId, restaurantName) => {
    const restaurant = await Restaurant.findOne({ "universityId": universityId, "restaurantName": restaurantName });
    return restaurant;
};

const findAllRestaurantByUniversityId = async (universityId) => {
    const restaurantList = await Restaurant.find({ "universityId": universityId });
    return restaurantList;
};

const deleteRestaurant = async (restaurantId) => {
    await Restaurant.findByIdAndDelete(restaurantId);
};

module.exports = {
    createRestaurant,
    findRestaurantById,
    findRestaurantByName,
    findAllRestaurantByUniversityId,
    deleteRestaurant
};