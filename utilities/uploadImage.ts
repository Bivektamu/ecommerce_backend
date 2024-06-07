import path from "path";
import fs from 'fs'
import { inputProductImg } from "../typeDefs";
import mongoose from "mongoose";

const uploadImage = async (item: inputProductImg, folder: string) => {
    const file = await item.img

    const { createReadStream, filename, mimetype, encoding } = file;
    const stream = createReadStream()

    const directory = path.join(process.cwd(), folder)

      // Check if the directory exists
      if (!fs.existsSync(directory)) {
        // Create the directory (and any necessary subdirectories)
        fs.mkdirSync(directory, { recursive: true });
      }

    const pathName = path.join(directory, filename as string)

    console.log(pathName);
    

    stream.pipe(fs.createWriteStream(pathName))

    const url = `http://localhost:3000${folder.replace('public','')}/${filename}`

    const uploadedImage = {
        _id: new mongoose.Types.ObjectId(item._id) ,
        url,
        fileName: filename
    }
    return uploadedImage
}

export default uploadImage