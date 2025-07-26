
import { GraphQLUpload } from 'graphql-upload-ts'
import adminRresolver from "./auth.resolver";
import customerRresolver from "./customer.resolver";
import productResolver from './product.resolver';
import verifyUser from '../../utilities/verifyUser';
import path from 'path';
import fs from 'fs'
import orderResolver from './order.resolver';
import wishListResolver from './wishList.resolver';
const globalResolver = {
    Upload: GraphQLUpload,
    // Mutation: {
    //     uploadFile: async (parent: any, args: any) => {

    //         const file = await args.input.file
            
            
    //         const { createReadStream, filename, mimetype, encoding } = file;
    //         const stream = createReadStream()

    //         const pathName = path.join(process.cwd(), `public/images/${filename}`)

    //         await stream.pipe(fs.createWriteStream(pathName))

    //         return {
    //             url:`http://localhost:3000/images/${filename}`
    //         }
    //     },

      
    // },
   
}

export default [globalResolver, customerRresolver, adminRresolver, productResolver, orderResolver, wishListResolver]