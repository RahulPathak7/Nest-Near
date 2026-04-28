const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: String,
  price: Number,
  address: String,
  college: { type: String, default: "" }, // ✅ FIX
  amenities: [String],
  contact: String,
  images: [String],
  lat: Number,
  lng: Number
});

module.exports = mongoose.model("Room", roomSchema);