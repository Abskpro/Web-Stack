// const AdminBro = require('admin-bro');
// const AdminBroExpress = require('@admin-bro/express');
// const router = require("express").Router();
// const House = require("../models/house.model.js");
// const Room = require("../models/rooms.model.js");
// const { v4: uuidv4 } = require("uuid");
// const { cloudinary } = require("../config/cloudinary");


// const HouseFetch = (req, res) => {
//   House.find({}).then((data) => {
//     res.json(data);
//   });
// };

// const RoomFetch = (req, res) => {
//   Room.find({}).then((data) => {
//     res.json(data);
//   });
// };

// const DeletePost = (req, res) => {
//   Room.findByIdAndDelete(req.params.id)
//     .then((data) => {
//       console.log(data);
//       data.imageCollection.map((id) => {
//         cloudinary.uploader.destroy(id, (error, result) =>
//           console.log(result, error)
//         );
//       });
//     })
//     .then(() => res.json("post deleted"))
//     .catch((err) => res.status(404).json("error" + err));
// };

// const FetchRoomByLocation = (req, res) => {
//   Room.find({ location: req.body.data.location })
//     .then(async (data) => {
//       res.json(data);
//     })
//     .catch((err) => console.log(err));
// };

// const FetchHouseByLocation = (req, res) => {
//   House.find({ location: req.body.data.location })
//     .then(async (data) => {
//       res.json(data);
//     })
//     .catch((err) => console.log(err));
// };

// module.exports = {
//   FetchHouseByLocation,
//   FetchRoomByLocation,
//   HouseFetch,
//   RoomFetch,
// };
