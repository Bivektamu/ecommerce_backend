import fs from 'fs'
import path from "path";

import Product from "../../dataLayer/schema/Product";
import verifyUser from "../../utilities/verifyUser";
import uploadImage from "../../utilities/uploadImage";
import { inputProductImg } from '../../typeDefs';

const productResolver = {
  Query: {
    products: async (parent: any, args: any, context: any) => {
      const admin = context.admin
      if (!admin) {
        throw new Error('Not Authenticated')
      }
      const products = await Product.find()
      return products
    },
    product: async (parent: any, args: any, context: any) => {
      const admin = context.admin
      if (!admin) {
        throw new Error('Not Authenticated')
      }
      const id = args.id
      const findproduct = await Product.findById(id)
      return findproduct
    }
  },

  Mutation: {
    createProduct: async (parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new Error('Not Authenticated')
      }

      const admin = verifyUser(context.token)
      if (!admin) {
        throw new Error('Not Authenticated')
      }

      const { title, slug, description, colors, sizes, price, category, quantity, sku, stockStatus, featured, imgs } = args.input

      
      
      const productExists = await Product.findOne({ slug: slug.toLowerCase() })
      if (productExists) {
        throw new Error('Product Already Exists')
      }

      const directory = path.join(process.cwd(), `public/upload/product`)


      // Check if the directory exists
      if (!fs.existsSync(directory)) {
        // Create the directory (and any necessary subdirectories)
        fs.mkdirSync(directory, { recursive: true });
      }

      let newImgs = []

      try {
        const uploadPromises = imgs.map((item: inputProductImg) => uploadImage(item, directory))
         newImgs = await Promise.all(uploadPromises);
      } catch (error) {
        throw error
      }

      const newProduct = new Product({
        title, slug, description, colors, sizes, price, quantity, category, sku, stockStatus, featured, imgs:newImgs
      })

      return await newProduct.save()
    },



    // Delete Product Mutation
    deleteProduct: async (parent: any, args: any) => {
      const { id } = args

      try {
        const productExists = await Product.findByIdAndDelete(id)
        if (productExists) {
          return {
            success: true,
          }

        }
        throw new Error('User not found')
      } catch (error) {
        if (error instanceof Error) {
          throw error
        }
      }
    }


  }
};

export default productResolver