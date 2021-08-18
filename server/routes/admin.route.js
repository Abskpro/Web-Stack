const AdminBro = require("admin-bro");
const AdminBroMongoose = require("@admin-bro/mongoose");
const AdminBroExpress = require("@admin-bro/express");
const argon2 = require("argon2");
const House = require("../models/house.model.js");
const Room = require("../models/rooms.model.js");
const mongoose = require("mongoose");
const { Company } = require("../models/admin.model");
const AdminCompany = require("../controllers/admin.controller");

AdminBro.registerAdapter(AdminBroMongoose);

const Bro = new AdminBro({
    databases: [mongoose],
    rootPath: "/admin",
    branding: {
        companyName: "Property Finder",
    },
    resources: [AdminCompany],
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
        const company = await Company.findOne({ email });

        if (
            company &&
            (await argon2.verify(company.encryptedPassword, password))
        ) {
            return company.toJSON();
        } else if (email === ADMIN.email && password === ADMIN.password) {
            return ADMIN;
        }
        return null;
    },
});

module.exports = router;
