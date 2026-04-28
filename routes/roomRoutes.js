const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const upload = require("../config/multer");

// Add Room
router.get("/add", roomController.getAddRoomPage);
router.post("/add", upload.array("images"), roomController.addRoom);

// Dashboard
router.get("/dashboard", roomController.dashboard);

// Map
router.get("/map", async (req, res) => {
  const Room = require("../models/Room");
  const rooms = await Room.find();
  res.render("map", { rooms });
});

// Save
router.get("/save/:id", roomController.toggleSave);

// Saved page
router.get("/saved", roomController.savedRooms);

// Search
router.get("/search", roomController.search);

// Edit
router.get("/edit/:id", roomController.getEditRoomPage);
router.post("/edit/:id", upload.array("images"), roomController.updateRoom);

// Delete
router.get("/delete/:id", roomController.deleteRoom);

// All rooms
router.get("/", roomController.getRooms);

// ⚠️ ALWAYS LAST
router.get("/:id", roomController.getRoomById);

module.exports = router;