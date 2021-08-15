const mongoose = require("mongoose");
const { RoomSchema } = require("../models/rooms.model");

const notificationSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Notify = mongoose.model("Notify", notificationSchema);

module.exports = Notify;
