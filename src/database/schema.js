const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');


const university = new Schema({
    universityName: {
        required: true,
        type: String
    },
    latitude: {
        required: true,
        type: String
    },
    longitude: {
        required: true,
        type: String
    }
});

const restaurant = new Schema({
    universityId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'University'
    },
    restaurantName: {
        required: true,
        type: String
    },
    latitude: {
        required: true,
        type: String
    },
    longitude: {
        required: true,
        type: String
    }
});

const menu = new Schema({
    restaurantId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    date: {
        required: true,
        type: String
    },
    breakfast: {
        type: String
    },
    lunch: {
        type: String
    },
    dinner: {
        type: String
    }
});

const University = mongoose.model('University', university);

const Restaurant = mongoose.model('Restaurant', restaurant);

const Menu = mongoose.model('Menu', menu);

module.exports = {
    University,
    Restaurant,
    Menu
};