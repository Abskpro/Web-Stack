const AdminBro = require("admin-bro");
const AdminBroMongoose = require("@admin-bro/mongoose");
const AdminBroExpress = require("@admin-bro/express");
const House = require("../models/house.model.js");
const Room = require("../models/rooms.model.js");
const mongoose = require("mongoose");

AdminBro.registerAdapter(AdminBroMongoose);

const Bro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
  branding: {
    companyName: "Property Finder",
  },
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL || "admin@project.com",
  password: process.env.ADMIN_PASSWORD || "password1",
};

const router = AdminBroExpress.buildAuthenticatedRouter(Bro, {
  cookieName: process.env.ADMIN_COOKIE_NAME || "admin-bro",
  cookiePassword:
    process.env.ADMIN_COOKIE_PASS ||
    "supersecret-and-long-password-for-a-cookie-in-the-browser",
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
});

module.exports = router;
