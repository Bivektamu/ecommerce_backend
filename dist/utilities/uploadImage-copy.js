"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadImage = async (item, folder, name) => {
    try {
        const file = await item.img;
        const { createReadStream, filename } = file;
        const stream = createReadStream();
        const directory = path_1.default.join(process.cwd(), folder);
        // Check if the directory exists
        if (!fs_1.default.existsSync(directory)) {
            // Create the directory (and any necessary subdirectories)
            console.log(folder);
            fs_1.default.mkdirSync(directory, { recursive: true });
        }
        let newName = filename;
        newName = name + '-' + item._id + path_1.default.extname(filename);
        const pathName = path_1.default.join(directory, newName);
        stream.pipe(fs_1.default.createWriteStream(pathName));
        const url = `https://ecommerce-backend-ruby-rho.vercel.app${folder.replace('public', '')}/${newName}`;
        const uploadedImage = {
            _id: item._id,
            url,
            fileName: newName
        };
        return uploadedImage;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.default = uploadImage;
