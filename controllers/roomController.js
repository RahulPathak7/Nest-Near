const Room = require("../models/Room");
const User = require("../models/User");

// 🏠 Get all rooms
exports.getRooms = async (req, res) => {
  const rooms = await Room.find().sort({ _id: -1 });
  res.render("rooms", { rooms });
};

// ➕ Add page
exports.getAddRoomPage = (req, res) => {
  res.render("addRoom");
};

// ➕ Add room (FIXED)
exports.addRoom = async (req, res) => {
  try {
    const { title, price, address, contact, college, lat, lng } = req.body;

    const images = req.files
      ? req.files.map((f) => "/uploads/" + f.filename)
      : [];

    const newRoom = await Room.create({
      title,
      price,
      address,
      contact,
      college: String(college).trim(), // ✅ FORCE STRING SAVE
      lat,
      lng,
      images
    });

    console.log("SAVED ROOM:", newRoom); // 🔥 DEBUG

    res.redirect("/rooms");
  } catch (err) {
    console.log(err);
    res.send("Error adding room");
  }
};

// 📊 Dashboard
exports.dashboard = async (req, res) => {
  const rooms = await Room.find();
  res.render("dashboard", { rooms });
};

// ❤️ Save toggle
exports.toggleSave = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  const user = await User.findById(req.session.user.id);

  const index = user.savedRooms.indexOf(req.params.id);

  if (index === -1) user.savedRooms.push(req.params.id);
  else user.savedRooms.splice(index, 1);

  await user.save();

  res.redirect("/rooms");
};

// ❤️ Saved page
exports.savedRooms = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  const user = await User.findById(req.session.user.id).populate("savedRooms");

  res.render("saved", { rooms: user.savedRooms });
};

// 🔎 SEARCH (title + address + college)
exports.search = async (req, res) => {
  try {
    const query = req.query.q || "";

    const rooms = await Room.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { college: { $regex: query, $options: "i" } }
      ]
    });

    res.render("rooms", { rooms });
  } catch (err) {
    console.log(err);
    res.send("Search error");
  }
};

// 🔍 Get single room (FIXED)
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.send("Room not found");
    }

    res.render("roomDetail", { 
      room,
      user: req.session.user || null   // ✅ IMPORTANT FIX
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading room");
  }
};

// ❌ Delete Room
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.redirect("/rooms");
  } catch (err) {
    console.log(err);
    res.send("Error deleting room");
  }
};

// ✏️ Show Edit Page
exports.getEditRoomPage = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    res.render("editRoom", { room });
  } catch (err) {
    console.log(err);
    res.redirect("/rooms");
  }
};

// ✏️ Update Room (KEEP MAP WORKING)
exports.updateRoom = async (req, res) => {
  try {
    const { title, address, price, contact, lat, lng, college } = req.body;

    let updateData = {
      title,
      address,
      price,
      contact,
      lat,      // ✅ keep map working
      lng,      // ✅ keep map working
        college: college ? college.trim() : "" // ✅ FIXED
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => "/uploads/" + file.filename);
    }

    await Room.findByIdAndUpdate(req.params.id, updateData);

    res.redirect("/rooms/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Error updating room");
  }
};



