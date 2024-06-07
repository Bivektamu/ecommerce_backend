import fs from 'fs'
import path from "path";

import Product from "../../dataLayer/schema/Product";
import verifyUser from "../../utilities/verifyUser";
import uploadImage from "../../utilities/uploadImage";
import { inputProductImg } from '../../typeDefs';
import deleteImage from '../../utilities/deleteImage';

const productResolver = {
  Query: {
    products: async (parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new Error('Not Authenticated')
      }

      const admin = verifyUser(context.token)
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

      const folder = `public/upload/product`

      let newImgs = []

      try {
        const uploadPromises = imgs.map((item: inputProductImg) => uploadImage(item, folder, slug))
        newImgs = await Promise.all(uploadPromises);
      } catch (error) {
        throw error
      }

      const newProduct = new Product({
        title, slug, description, colors, sizes, price, quantity, category, sku, stockStatus, featured, imgs: newImgs
      })

      return await newProduct.save()
    },

    // Delete Product Mutation
    deleteProduct: async (parent: any, args: any, context: any) => {

      if (!context.token) {
        throw new Error('Not Authenticated')
      }

      const admin = verifyUser(context.token)
      if (!admin) {
        throw new Error('Not Authenticated')
      }

      const { id } = args

      try {
        const product = await Product.findById(id)
        if (product) {
          const imgLinks = product?.imgs.map(img => img.url)

          imgLinks.map(link => deleteImage(link))

          const productExists = await Product.findByIdAndDelete(id)
          if (productExists) {
            return {
              success: true,
            }
          }
        }

        throw new Error('Bad Request')
      } catch (error) {
        if (error instanceof Error) {
          throw error
        }
      }
    }


  }
};

export default productResolver