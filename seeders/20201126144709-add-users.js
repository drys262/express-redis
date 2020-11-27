const { v4: uuidv4 } = require('uuid');
const { Chance } = require('chance');
const bcrypt = require('bcrypt');
const R = require('ramda');

const chance = new Chance();

const saltRounds = 10;
const examplePassword = 'password';

const generateUser = () => ({
  id: uuidv4(),
  name: chance.name(),
  email: chance.email(),
  username: chance.first(),
  password: bcrypt.hashSync(examplePassword, saltRounds),
  createdAt: new Date(),
  updatedAt: new Date(),
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', R.times(generateUser, 5));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
