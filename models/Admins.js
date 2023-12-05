const mongoose = require("mongoose");

const AdminsSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Admins", AdminsSchema);
