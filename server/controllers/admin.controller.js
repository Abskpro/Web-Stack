const AdminBro = require("admin-bro");
const { Company } = require("../models/admin.model");

const {
    after: passwordAfterHook,
    before: passwordBeforeHook,
} = require("../utils/password.hook");

/** @type {AdminBro.ResourceOptions} */
const options = {
    properties: {
        encryptedPassword: {
            isVisible: false,
        },
        password: {
            type: "password",
        },
    },
    actions: {
        new: {
            after: passwordAfterHook,
            before: passwordBeforeHook,
        },
        edit: {
            after: passwordAfterHook,
            before: passwordBeforeHook,
        },
    },
};

module.exports = {
    options,
    resource: Company,
};
