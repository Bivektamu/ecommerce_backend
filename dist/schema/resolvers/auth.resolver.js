"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyUser_1 = __importDefault(require("../../utilities/verifyUser"));
const typeDefs_1 = require("../../typeDefs");
const validateForm_1 = __importDefault(require("../../utilities/validateForm"));
const Customer_1 = __importDefault(require("../../dataLayer/schema/Customer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authResolver = {
    Mutation: {
        logInAdmin: async (parent, args, context) => {
            const { email, password } = args.input;
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                const payload = {
                    role: typeDefs_1.User.ADMIN,
                    id: process.env.ADMIN_ID
                };
                const signOptions = {
                    expiresIn: '1h'
                };
                const secret = process.env.JWTSECRET;
                const token = (0, jsonwebtoken_1.sign)(payload, secret, signOptions);
                return {
                    token
                };
            }
            else {
                throw new Error('Bad Credentials');
            }
        },
        logInCustomer: async (parent, args, context) => {
            const { email, password } = args.input;
            const validateSchema = [
                { value: email, name: 'email', type: 'email' },
                { value: password, name: 'password', type: 'password' },
            ];
            const errors = (0, validateForm_1.default)(validateSchema);
            if (Object.keys(errors).length > 0) {
                throw new Error(JSON.stringify(errors));
            }
            const user = await Customer_1.default.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw new Error('Bad Credentials');
            }
            const isMatched = bcrypt_1.default.compareSync(password, user.password);
            if (!isMatched) {
                throw new Error('Bad Credentials');
            }
            const payload = {
                role: typeDefs_1.User.CUSTOMER,
                id: user.id
            };
            const signOptions = {
                expiresIn: '1h'
            };
            const secret = process.env.JWTSECRET;
            const token = (0, jsonwebtoken_1.sign)(payload, secret, signOptions);
            return {
                token
            };
        },
    },
    Query: {
        getAuthStatus: (parent, args, context) => {
            if (!context.token) {
                return { isLoggedIn: false };
            }
            const user = (0, verifyUser_1.default)(context.token);
            if (!user) {
                return { isLoggedIn: false, user: null };
            }
            return { isLoggedIn: true, user: user };
        }
    },
};
exports.default = authResolver;
