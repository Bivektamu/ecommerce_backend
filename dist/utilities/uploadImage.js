"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3"); // ES Modules import
const lib_storage_1 = require("@aws-sdk/lib-storage");
const uploadImage = async (item, folder, name) => {
    const file = await item.img;
    const { createReadStream, filename, mimetype, encoding } = await file;
    let newName = filename;
    newName = name + '-' + item._id + path_1.default.extname(filename);
    const config = {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };
    try {
        const aws_client = new client_s3_1.S3Client(config);
        const input = {
            ContentType: mimetype,
            Bucket: process.env.AWS_BUCKET,
            Key: newName,
            Body: createReadStream()
        };
        const upload = new lib_storage_1.Upload({
            client: aws_client,
            params: input
        });
        const data = await upload.done();
        if (data) {
            const url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${newName}`;
            const uploadedImage = {
                _id: item._id,
                url,
                fileName: newName
            };
            return uploadedImage;
        }
    }
    catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
    // const stream = createReadStream()
    // const directory = path.join(process.cwd(), folder)
    // // Check if the directory exists
    // if (!fs.existsSync(directory)) {
    //   // Create the directory (and any necessary subdirectories)
    //   console.log(folder);
    //   fs.mkdirSync(directory, { recursive: true });
    // }
    // let newName = filename as string
    // newName = name + '-' + item._id + path.extname(filename)
    // const pathName = path.join(directory, newName)
    // stream.pipe(fs.createWriteStream(pathName))
    // const url = `https://ecommerce-backend-ruby-rho.vercel.app${folder.replace('public', '')}/${newName}`
    // const uploadedImage = {
    //   _id: item._id,
    //   url,
    //   fileName: newName
    // }
    // return uploadedImage
};
exports.default = uploadImage;
