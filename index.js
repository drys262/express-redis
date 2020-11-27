const app = require('./src/app');
const { sequelize } = require('./models');
const PORT = 8080;

async function checkDBConnection() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the DB.');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await checkDBConnection();
  app.listen(PORT, () => {
    console.log(`Server started on port http://0.0.0.0:${PORT}.`);
  });
}

init();
