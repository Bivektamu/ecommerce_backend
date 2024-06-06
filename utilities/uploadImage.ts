import path from "path";
import fs from 'fs'
import { inputProductImg } from "../typeDefs";

const uploadImage = async (item: inputProductImg, directory: string) => {
    const file = await item.img

    const { createReadStream, filename, mimetype, encoding } = file;
    const stream = createReadStream()

    const pathName = path.join(directory, filename as string)


    stream.pipe(fs.createWriteStream(pathName))

    const uploadedImage = {
        id: item.id,
        url: `http://localhost:3000/images/${filename}`,
        fileName: filename
    }
    return uploadedImage
}

export default uploadImage