"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyUser = (token) => {
    const verifiedUser = (0, jsonwebtoken_1.verify)(token, process.env.JWTSECRET);
    console.log('asdf');
    console.log(verifiedUser);
    if (verifiedUser) {
        const userRole = {
            role: verifiedUser.role,
            id: verifiedUser.id
        };
        return userRole;
    }
    return null;
};
exports.default = verifyUser;
