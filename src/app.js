const mongoose = require('mongoose');
const express = require('express');
const router = require('./routes');

// env
require("dotenv").config();

// connect to mongoDB
mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error(err);
    });

const app = express();
const server = require('http').createServer(app);

app.use((err, req, res, next) => {
    if(err) {
        console.log(err);
        res.send(err);
    } else {
        console.log('logging for routers');
        next();
    }
});

app.use(express.json());
app.use('/', router);
server.listen(process.env.PORT, () => console.log(`${process.env.BACKEND_BASE_URL}:${process.env.PORT}`));