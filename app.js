const express = require("express");
const path = require("path");
const session = require("express-session");
const connectDB = require("./utils/db");

const app = express();

// DB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: true,
  })
);

// Navbar user
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// View engine
app.set("view engine", "ejs");

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/rooms", require("./routes/roomRoutes"));

// Saved page
const roomController = require("./controllers/roomController");
app.get("/saved", roomController.savedRooms);

// Home
app.get("/", (req, res) => {
  res.render("index");
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("=================================");
});