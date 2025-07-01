"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_typeDef_1 = __importDefault(require("./auth.typeDef"));
const customer_typeDef_1 = __importDefault(require("./customer.typeDef"));
const global_typeDef_1 = __importDefault(require("./global.typeDef"));
const product_typeDef_1 = __importDefault(require("./product.typeDef"));
const review_typeDef_1 = __importDefault(require("./review.typeDef"));
exports.default = [global_typeDef_1.default, auth_typeDef_1.default, customer_typeDef_1.default, product_typeDef_1.default, review_typeDef_1.default];
