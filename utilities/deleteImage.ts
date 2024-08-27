import fs from 'fs'
import { ProductImage, inputProductImg } from "../typeDefs";
import mongoose from "mongoose";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import

const deleteImage = async (image: string) => {

  const config = {
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }

  try {
    const aws_client = new S3Client(config);
    const input = { Bucket: process.env.AWS_BUCKET as string, Key: image }
    const data = await aws_client.send(new DeleteObjectCommand(input));
    console.log("Success. Object deleted.", data);
  } catch (err) {
    if (err instanceof Error)
      console.log(err.message);
      throw err
  }
}

export default deleteImage