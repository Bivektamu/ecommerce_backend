import User from "../../dataLayer/schema/User";
import { Address, ErrorCode, FormError, UserRole, ValidateSchema } from "../../typeDefs";
import validateForm from "../../utilities/validateForm";
import bcrypt from 'bcrypt'
import verifyUser from "../../utilities/verifyUser";
import { GraphQLError } from "graphql";

const customerRresolver = {
  Query: {
    customers: async (parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new Error('Not Authenticated')
      }
      const user = verifyUser(context.token)
      if (user?.role !== UserRole.ADMIN) {
        throw new Error('Not Authenticated')
      }
      const customers = await User.find()
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
      const findCustomer = await User.findById(id)
      return findCustomer
    },
    customerEmail: async (parent: any, args: any) => {
      const id = args.id
      const findCustomer = await User.findById(id)
      if (!findCustomer) {
        throw new Error('Customer email not found')
      }
      return findCustomer.email
    },
    customerName: async (parent: any, args: any) => {
      const id = args.id
      const findCustomer = await User.findById(id)
      if (!findCustomer) {
        throw new Error('Customer email not found')
      }
      return { firstName: findCustomer.firstName, lastName: findCustomer.lastName }
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

      const customerExists = await User.findOne({ email: email.toLowerCase() })
      if (customerExists) {
        throw new Error('User already exists')
      }

      const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        role: UserRole.CUSTOMER
      })

      const salt = bcrypt.genSaltSync(8)

      user.password = bcrypt.hashSync(password, salt)

      return await user.save()
    },
    deleteCustomer: async (parent: any, args: any) => {
      const { id } = args

      try {
        const deletedUser = await User.findByIdAndDelete(id)
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
    },

    updateAddress: async (parent: any, args: any, context: any) => {


      if (!context.token) {
        throw new Error('Not Authenticated')
      }

      const user = verifyUser(context.token)
      if (!user || user.role !== UserRole.CUSTOMER) {
        throw new Error('Not Authenticated')
      }

      const { street, city, state, postcode, country } = args.input

      const validateSchema: ValidateSchema<any>[] = [
        { value: street, name: 'street', type: 'string' },
        { value: city, name: 'city', type: 'string' },
        { value: state, name: 'state', type: 'string' },
        { value: postcode, name: 'postcode', type: 'string', required: false },
        { value: country, name: 'country', type: 'string' },
      ]

      const errors: FormError = validateForm(validateSchema)

      if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors))
      }
      const findCustomer = await User.findById(user.id)
      if (!findCustomer) {
        throw new Error('Customer not found')
      }
      const address: Address = {
        street, city, state, country, postcode
      }

      try {

        const updateStatus = await User.updateOne(
          { _id: user.id },
          {
            $set: {
              address
            }

          }
        )

        const { acknowledged, modifiedCount } = updateStatus
        if (acknowledged && modifiedCount === 1) {
          return address
        }
        else throw new GraphQLError('Sorry address could not updated. Please try later',
          {
            extensions: {
              code : ErrorCode.SHIPPING_ADDRESS_ERROR
            }
          }
        )


      } catch (error) {
        if (error instanceof Error)
          throw new Error(error.message)
      }

    }

  }
};

export default customerRresolver