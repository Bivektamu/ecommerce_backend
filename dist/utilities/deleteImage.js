"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3"); // ES Modules import
const deleteImage = async (image) => {
    const config = {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };
    try {
        const aws_client = new client_s3_1.S3Client(config);
        const input = { Bucket: process.env.AWS_BUCKET, Key: image };
        const data = await aws_client.send(new client_s3_1.DeleteObjectCommand(input));
        console.log("Success. Object deleted.", data);
    }
    catch (err) {
        if (err instanceof Error)
            console.log(err.message);
        throw err;
    }
};
exports.default = deleteImage;
