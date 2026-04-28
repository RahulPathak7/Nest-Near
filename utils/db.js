const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://RahulPathak:Ajay123@ac-egq0lsy-shard-00-00.zxprpv5.mongodb.net:27017,ac-egq0lsy-shard-00-01.zxprpv5.mongodb.net:27017,ac-egq0lsy-shard-00-02.zxprpv5.mongodb.net:27017/?ssl=true&replicaSet=atlas-d53tu3-shard-0&authSource=admin&appName=luv-cluster");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;