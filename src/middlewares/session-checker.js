// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.name) {
    res.redirect('/');
  } else {
    next();
  }
};

module.exports = sessionChecker;
