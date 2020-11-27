const models = require('../../models');
const comparePassword = require('../library/compare-password');

const signIn = async function (_req, res) {
  return res.render('pages/signin', { wrongCredentials: false, user: {} });
};

const postSignIn = async function (req, res) {
  const { email, password } = req.body;
  const { user: UserModel } = models;
  const user = await UserModel.findOne({ where: { email } });
  if (!user || !comparePassword(password, user.password)) {
    return res.render('pages/signin', { wrongCredentials: true, user: {} });
  }

  req.session.name = user.name;
  return res.redirect(301, '/');
};

const signOut = async function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });
};

module.exports = {
  signIn,
  signOut,
  postSignIn,
};
