const { sequelize } = require('../../models');

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

module.exports = checkDBConnection;
