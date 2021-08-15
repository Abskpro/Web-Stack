const mongoose = require("mongoose");

const HouseSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coordinates: {
    latitude: {
      type: String,
      // required: true,
    },
    longitude: {
      type: String,
      // required: true,
    },
  },
  area: {
    type: Number,
    required: true,
  },
  rooms: {
    bedroom: {
      type: Number,
      required: true,
    },
    kitchen: {
      type: Number,
      required: true,
    },
    toilet: {
      type: Number,
      required: true,
    },
    livingRoom: {
      type: Number,
      required: true,
    },
  },
  facilities: {
    type: Array,
    required: true,
  },
  furnished: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageCollection: {
    type: Array,
    // required: true,
  },
});

const House = mongoose.model("House", HouseSchema);

module.exports = House;
