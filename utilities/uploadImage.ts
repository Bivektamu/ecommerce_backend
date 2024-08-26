import path from "path";
import fs from 'fs'
import { inputProductImg } from "../typeDefs";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import



const uploadImage = async (item: inputProductImg, folder: string, name: string) => {


  try {

    const file = await item.img

    const yourBufferData = Buffer.from(file, 'base64');


    
    
    const config = {
      region: process.env.AWS_REGION as string,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string

    }

    
    
    const client = new S3Client(config);

    const input = { // PutObjectRequest
      Bucket: process.env.AWS_BUCKET,
      Key: item._id,
      Body: yourBufferData
    }
    const data = await client.send(new PutObjectCommand(input));
    console.log('File uploaded successfully:', data);

    throw new Error("Working.");

  } catch (error) {
    console.error('Error uploading file:', error);
    throw error
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

}

export default uploadImage