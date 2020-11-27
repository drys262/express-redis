const home = async function (req, res) {
  if (req.session.name) {
    return res.render('pages/index', { user: { name: req.session.name } });
  }
  res.render('pages/index', { user: {} });
};

module.exports = {
  home,
};
