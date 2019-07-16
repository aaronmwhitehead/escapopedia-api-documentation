const cheerio = require("cheerio");
const axios = require("axios");
const retry = require('axios-retry');
const mongoose = require('mongoose');
const Company = require('../models/company');
const Location = require('../models/location');
const Room = require('../models/room');
const Franchise = require('../models/franchise');
const request = require('request');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

const rooms = require('./rooms');
const companies = require('./companies');
const franchises = require('./franchises');
const locations = require('./locations');

cloudinary.config({
    cloud_name: 'dedgerky',
    api_key: '757979452591623',
    api_secret: 'LP3rX9cErL2njlRrG8V7tJq-QX4'
});

const baseUrl = 'https://worldofescapes.com';
retry(axios);
// mongodb+srv://aaronwhitehead4:aaron18237!@escapopedia-hpxpy.mongodb.net/test?retryWrites=true&w=majority
// mongodb://127.0.0.1:23456/escapopedia
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://127.0.0.1:23456/escapopedia', {
    useNewUrlParser: true,
    useCreateIndex: true
});

async function doTheThing() {
   companies.companies.forEach((company) => {
       company.franchises.forEach((franchise) => {
           Franchise.find({ _id: franchise })
            .then((franchise) => {
                console.log(franchise);
            })
       })
   })
}

doTheThing();