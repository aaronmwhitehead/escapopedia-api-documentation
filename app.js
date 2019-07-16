const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
var hbs = require('express-handlebars');
const dotenv = require('dotenv');

const accounts = require('./routes/accounts');
const companies = require('./routes/companies');
const franchises = require('./routes/franchises');
const locations = require('./routes/locations');
const rooms = require('./routes/rooms');
const router = require('./routes/router');

dotenv.config();

// mongodb://127.0.0.1:23456/escapopedia
mongoose.connect('mongodb+srv://aaronwhitehead4:aaron18237%21@cluster0-hpxpy.mongodb.net/escapopedia?retryWrites=true&w=majority', {
    auto_reconnect: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: 10, 
    reconnectInterval: 3000,
    keepAlive: true
})
.then(() => {
    console.log('connected');
})
.catch(e => console.log('could not connect to mongodb', e));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, 'views'))
app.set('partials', path.join(__dirname, 'views/partials'))
app.set('view engine', 'hbs'); 

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'index',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

// Redirect all routes with trailing spaces to the route without
app.use((req, res, next) => {
    const test = /\?[^]*\//.test(req.url);
    if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
        res.redirect(301, req.url.slice(0, -1));
    else
        next();
});

app.get('/', router.home);
app.get('/features', router.features);
app.get('/contact', router.contact);
app.post('/contact', router.contact);

app.get('/create/account', accounts.create);
app.get('/account', accounts.retrieve);
app.get('/update/account', accounts.update);
app.get('/delete/account', accounts.delete);

app.post('/add/franchises/:id', franchises.create);
app.post('/franchises', franchises.retrieve);
app.post('/update/franchises/:id', franchises.update);
app.post('/delete/franchises/:id', franchises.delete);

app.post('/add/companies/:id', companies.create);
app.post('/companies', companies.retrieve);
app.post('/update/companies/:id', companies.update);
app.post('/delete/companies/:id', companies.delete);

app.post('/add/locations/:id', locations.create);
app.post('/locations', locations.retrieve);
app.post('/update/locations/:id', locations.update);
app.post('/delete/locations/:id', locations.delete);

app.post('/add/rooms/:id', rooms.create);
app.post('/rooms', rooms.retrieve);
app.post('/update/rooms/:id', rooms.update);
app.post('/delete/rooms/:id', rooms.delete);

app.get('/api', router.api);

app.get('/404', router.send404);

app.get('*', (req, res) => {
    res.redirect('/404');
});

console.log('Listening on port ', process.env.PORT || 3000 );
app.listen(process.env.PORT || 3000)

