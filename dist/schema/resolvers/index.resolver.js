"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_upload_ts_1 = require("graphql-upload-ts");
const auth_resolver_1 = __importDefault(require("./auth.resolver"));
const customer_resolver_1 = __importDefault(require("./customer.resolver"));
const product_resolver_1 = __importDefault(require("./product.resolver"));
const verifyUser_1 = __importDefault(require("../../utilities/verifyUser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const globalResolver = {
    Upload: graphql_upload_ts_1.GraphQLUpload,
    Mutation: {
        uploadFile: async (parent, args) => {
            const file = await args.input.file;
            const { createReadStream, filename, mimetype, encoding } = file;
            const stream = createReadStream();
            const pathName = path_1.default.join(process.cwd(), `public/images/${filename}`);
            await stream.pipe(fs_1.default.createWriteStream(pathName));
            return {
                url: `http://localhost:3000/images/${filename}`
            };
        },
    },
    Query: {
        getAuthStatus: (parent, args, context) => {
            if (!context.token) {
                return { isLoggedIn: false };
            }
            const admin = (0, verifyUser_1.default)(context.token);
            if (!admin) {
                return { isLoggedIn: false };
            }
            return { isLoggedIn: true };
        }
    },
};
exports.default = [globalResolver, customer_resolver_1.default, auth_resolver_1.default, product_resolver_1.default];
