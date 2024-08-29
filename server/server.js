const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require("dotenv").config();
require("../db/connection");

// Routes
const homepageRoute = require('../routes/homepage');
const menuRoute = require('../routes/menu');
const offerRoute = require('../routes/special-offer');
const aboutRoute = require('../routes/about');
const galleryRoute = require('../routes/gallery');
const contactRoute = require('../routes/contact');
const reviewsRoute = require('../routes/reviews');
const socialRoute = require('../routes/social');
const reserveRoute = require('../routes/reservation');
const sliderRoute=require("../routes/slider-route");
const email=require("../routes/email");

app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant API');
});


app.use('/homepage', homepageRoute);
app.use('/menu', menuRoute);
app.use('/offer', offerRoute);
app.use('/about', aboutRoute);
app.use('/gallery', galleryRoute);
app.use('/contact', contactRoute);
app.use('/reviews', reviewsRoute);
app.use('/social', socialRoute);
app.use('/reserve', reserveRoute);
app.use('/email', email);
app.use('/home-slider-upload', sliderRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
