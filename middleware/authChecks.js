// middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    return res.status(401).send('⛔ Access denied. Please login first.');
  }
  
  // middleware to check if user is admin
  function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    return res.status(403).send('⛔ Access denied. Admins only.');
  }
  
  // middleware to prevent login/register if already logged in
  function redirectIfAuthenticated(req, res, next) {
    if (req.session.user) {
      return res.status(403).send('⚠️ Already logged in. Logout to continue.');
    }
    return next();
  }
  

  module.exports = { isAuthenticated, isAdmin, redirectIfAuthenticated };