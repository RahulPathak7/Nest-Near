// Check if user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
};

// Check if user is landlord
exports.isLandlord = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "landlord") {
    return res.send("Access denied: Landlords only");
  }
  next();
};