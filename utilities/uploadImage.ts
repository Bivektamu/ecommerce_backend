import path from "path";
import fs from 'fs'
import { inputProductImg } from "../typeDefs";
import mongoose from "mongoose";
import { S3Client} from "@aws-sdk/client-s3"; // ES Modules import
import { Upload } from "@aws-sdk/lib-storage"


const uploadImage = async (item: inputProductImg, folder: string, name: string) => {

  const file = await item.img
  const { createReadStream, filename, mimetype, encoding } = await file;

  let newName = filename as string
  newName = name + '-' + item._id + path.extname(filename)

  const config = {
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }

  try {
    const aws_client = new S3Client(config);
    const input = { // PutObjectRequest
      ContentType: mimetype,
      Bucket: process.env.AWS_BUCKET as string,
      Key: newName,
      Body: createReadStream()
    }
    const upload = new Upload({
      client: aws_client,
      params: input
    })

    const data = await upload.done()

    if (data) {
      const url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${newName}`

      const uploadedImage = {
        _id: item._id,
        url,
        fileName: newName
      }
      return uploadedImage
    }


  } catch (error) {
    console.error('Error uploading file:', error);
    throw error
  }



  // const stream = createReadStream()
  // const directory = path.join(process.cwd(), folder)

  // // Check if the directory exists
  // if (!fs.existsSync(directory)) {
  //   // Create the directory (and any necessary subdirectories)

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