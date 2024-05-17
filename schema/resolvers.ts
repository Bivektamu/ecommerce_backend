import Customer from "../dataLayer/schema/Customer";

import { SignOptions, sign } from 'jsonwebtoken'
const resolvers = {
  Query: {
    customers: async () => {
      const customers = await Customer.find()
      return customers
    },
    customer: async (parent: any, args: any) => {
      const id = args.id
      const findCustomer = await Customer.findById(id)
      return findCustomer
    }
  },
  Mutation: {
    createCustomer: async (parent: any, args: any) => {
      const { email, password, firstName, lastName } = args.input
      const customerExists = await Customer.findOne({ email: email.toLowerCase() })
      if (customerExists) {
        return null
      }
      const customer = new Customer({
        firstName,
        lastName,
        email,
        password
      })

      return await customer.save()
    },
    deleteCustomer: async (parent: any, args: any) => {
      const { id } = args

      try {
        const a = await Customer.findByIdAndDelete(id)
        if (a) {
          return {
            success: true,
          }

        }
        throw new Error('User not found')
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            message: error.message
          }
        }
      }
    },
    logIn: async (parent:any, args:any) => {
      const {email, password} = args.input
      if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const payload = {
          admin: {
            id: process.env.ADMIN_ID
          }
        }

        const signOptions:SignOptions = {
          expiresIn: 360000 
        }
        const secret:string = process.env.JWTSECRET as string

        const token = sign(
          payload,
          secret,
          signOptions
        );

        console.log(token);
        
        return {
          success: true,
          value: token
        }
      }
      else {
        return {
          success: false,
          message:'Bad credentials'
        }
      }

    }
  }
};

export default resolvers