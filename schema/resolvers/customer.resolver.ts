import Customer from "../../dataLayer/schema/Customer";
import { FormError, User, ValidateSchema } from "../../typeDefs";
import validateForm from "../../utilities/validateForm";
import bcrypt from 'bcrypt'
import verifyUser from "../../utilities/verifyUser";

const customerRresolver = {
  Query: {
    customers: async (parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new Error('Not Authenticated')
      }
      const user = verifyUser(context.token)
      if (user?.userRole !== User.ADMIN) {
        throw new Error('Not Authenticated')
      }
      const customers = await Customer.find()
      return customers
    },
    customer: async (parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new Error('Not Authenticated')
      }
      const user = verifyUser(context.token)
      if (!user) {
        throw new Error('Not Authenticated')
      }
      const id = args.id
      const findCustomer = await Customer.findById(id)
      return findCustomer
    }
  },
  Mutation: {
    createCustomer: async (parent: any, args: any) => {
      const { email, password, firstName, lastName } = args.input

      const validateSchema: ValidateSchema<any>[] = [
        { value: firstName, name: 'firstName', type: 'string' },
        { value: lastName, name: 'lastName', type: 'string' },
        { value: email, name: 'email', type: 'email' },
        { value: password, name: 'password', type: 'password' },
      ]
      const errors: FormError = validateForm(validateSchema)
      if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors))
      }

      const customerExists = await Customer.findOne({ email: email.toLowerCase() })
      if (customerExists) {
        throw new Error('User already exists')
      }



      const customer = new Customer({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password
      })

      const salt = bcrypt.genSaltSync(8)

      customer.password = bcrypt.hashSync(password, salt)

      return await customer.save()
    },
    deleteCustomer: async (parent: any, args: any) => {
      const { id } = args

      try {
        const deletedUser = await Customer.findByIdAndDelete(id)
        if (deletedUser) {
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
    }

  }
};

export default customerRresolver