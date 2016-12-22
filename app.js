// modules
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const hbs = require('express-hbs');
const dotenv = require('dotenv');

// note that we load the process.env from `dotenv`
// before we start to load any of our own code.
const envfile = process.env.NODE_ENV === 'production' ? '.env' : '.dev.env';
dotenv.config({
  silent: true,
  path: `${__dirname}/${envfile}`,
});

// *now* load our custom Stripe charing module
// which we'll use in the router later on
const charge = require('./charge');

// create the server, and all the routes and configuration
// go against this `app`
const app = express();

// render using handlebars, but use .html as the extention
app.engine('html', hbs.express3({ extname: '.html' }));
app.set('view engine', 'html');
app.set('views', __dirname);
app.disable('x-powered-by');

// expose `process` to the view templates
app.locals.process = process;

// serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// enable the body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// the router

// GET /
app.get('/', (req, res) => {
  res.render('index');
});

// POST /charge
app.post('/charge', (req, res, next) => {
  charge(req).then(data => {
    res.render('thanks');
  }).catch(error => {
    res.render('error', error);
  });
});

// start
app.listen(process.env.PORT || 3000, () => {
  console.log('Listening');
});
