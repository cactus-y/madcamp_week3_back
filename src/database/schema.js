const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

const menu = new Schema({
    menuName: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: String
    },
    created_at: {
        type: Date,
        default: dayjs().tz().add(9, 'hour').format()
    }
});

const Menu = mongoose.model('Menu', menu);

module.exports = {
    Menu
};