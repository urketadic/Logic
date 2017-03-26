const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const app = express();

const dotenv = require('dotenv')
dotenv.load()

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


module.exports = app;
