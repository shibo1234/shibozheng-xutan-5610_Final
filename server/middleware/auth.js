function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).send("Not authenticated");
    }
}
  
module.exports = { isAuthenticated };
  