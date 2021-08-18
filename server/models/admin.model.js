const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    encryptedPassword: {
        type: String,
        required: true,
    },
});

const Company = mongoose.model("Company", CompanySchema);

module.exports = { CompanySchema, Company };
