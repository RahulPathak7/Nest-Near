const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.registerPage = (req, res) => {
  res.render("register");
};

exports.loginPage = (req, res) => {
  res.render("login");
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email) return res.send("Email required");

    const exists = await User.findOne({ email });
    if (exists) return res.send("User already exists");

    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hash, role });

    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    res.send("Register error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Wrong password");

  req.session.user = {
    id: user._id,
    name: user.name,
    role: user.role,
  };

  res.redirect("/");
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};