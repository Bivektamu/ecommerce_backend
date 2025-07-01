"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const deleteImage = async (image) => {
    const link = image.split('upload')[1];
    const imgPath = path_1.default.join(process.cwd(), 'public/upload', link);
    try {
        fs_1.default.unlinkSync(imgPath);
    }
    catch (err) {
        if (err instanceof Error)
            console.log(err.message);
    }
};
exports.default = deleteImage;
