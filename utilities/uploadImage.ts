import path from "path";
import fs from 'fs'
import { inputProductImg } from "../typeDefs";
import mongoose from "mongoose";

const uploadImage = async (item: inputProductImg, folder: string, name: string) => {
  const file = await item.img

  const { createReadStream, filename} = file;

  const stream = createReadStream()
  const directory = path.join(process.cwd(), folder)

  // Check if the directory exists
  if (!fs.existsSync(directory)) {
    // Create the directory (and any necessary subdirectories)
    fs.mkdirSync(directory, { recursive: true });
  }


  let newName = filename as string
  newName = name + '-' + item._id + path.extname(filename)

  const pathName = path.join(directory, newName)

  stream.pipe(fs.createWriteStream(pathName))

  const url = `http://localhost:3000${folder.replace('public', '')}/${newName}`

  const uploadedImage = {
    _id: new mongoose.Types.ObjectId(item._id),
    url,
    fileName: filename
  }
  return uploadedImage
}

export default uploadImage