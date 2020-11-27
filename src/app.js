const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const redis = require('redis');
const morgan = require('morgan');
const connectRedis = require('connect-redis');
const checkDbConnection = require('./library/check-db-connection');
const authRouter = require('./routes/auth');
const homeRouter = require('./routes/home');

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
app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', homeRouter);
app.use('/auth', authRouter);

checkDbConnection();

app.listen(PORT, () => {
  console.log(`Server started on port http://0.0.0.0:${PORT}.`);
});
