const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const redis = require('redis');
const morgan = require('morgan');
const connectRedis = require('connect-redis');
const comparePassword = require('./library/compare-password');
const models = require('../models/index');
const checkDbConnection = require('./library/check-db-connection');

const PORT = 8080;
const app = express();
const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

app.set('trust proxy', 1);

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function () {
  console.log('Connected to redis successfully');
});

// setup session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 10,
    },
  }),
);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.name) {
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  if (req.session.name) {
    return res.render('pages/index', { user: { name: req.session.name } });
  }
  res.render('pages/index', { user: {} });
});

app.get('/auth/signin', sessionChecker, (_req, res) => {
  res.render('pages/signin', { wrongCredentials: false, user: {} });
});

app.post('/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await models.user.findOne({ where: { email } });
  if (!user || !comparePassword(password, user.password)) {
    return res.render('pages/signin', { wrongCredentials: true, user: {} });
  }

  req.session.name = user.name;
  return res.redirect(301, '/');
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

checkDbConnection();

app.listen(PORT, () => {
  console.log(`Server started on port http://0.0.0.0:${PORT}.`);
});
