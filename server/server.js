const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

require("dotenv").config();
require("../db/connection");

// Routes
const homepageRoute = require('../routes/homepage');
const menuRoute = require('../routes/menu');
const aboutRoute = require('../routes/about');
const galleryRoute = require('../routes/gallery');
const contactRoute = require('../routes/contact');
const reviewsRoute = require('../routes/reviews');
const socialRoute = require('../routes/social');

app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant API');
});

app.use('/homepage', homepageRoute);
app.use('/menu', menuRoute);
app.use('/about', aboutRoute);
app.use('/gallery', galleryRoute);
app.use('/contact', contactRoute);
app.use('/reviews', reviewsRoute);
app.use('/social', socialRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
