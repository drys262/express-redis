const bcrypt = require('bcrypt');

const comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports = comparePassword;
