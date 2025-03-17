import Customer from "../../dataLayer/schema/Customer";
import { Address, FormError, User, ValidateSchema } from "../../typeDefs";
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
      if (user?.role !== User.ADMIN) {
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
    },
    customerEmail: async (parent: any, args: any) => {
      const id = args.id
      const findCustomer = await Customer.findById(id)
      if (!findCustomer) {
        throw new Error('Customer email not found')
      }
      return findCustomer.email
    },
    customerName: async (parent: any, args: any) => {
      const id = args.id
      const findCustomer = await Customer.findById(id)
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
    },

    updateAddress: async (parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new Error('Not Authenticated')
      }

      
      const user = verifyUser(context.token)
      if (!user || user.role !== User.CUSTOMER) {
        throw new Error('Not Authenticated')
      }

      const { street, city, state, zipcode, country } = args.input

      const validateSchema: ValidateSchema<any>[] = [
        { value: street, name: 'street', type: 'string' },
        { value: city, name: 'city', type: 'string' },
        { value: state, name: 'state', type: 'string' },
        { value: zipcode, name: 'zipcode', type: 'number', required: false },
        { value: country, name: 'country', type: 'string' },
      ]

      const errors: FormError = validateForm(validateSchema)

      if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors))
      }
      const findCustomer = await Customer.findById(user.id)
      if (!findCustomer) {
        throw new Error('Customer not found')
      }
      const address: Address = {
        street, city, state, country
      }
      if (zipcode > 0) {
        address.zipcode = zipcode
      }

      try {

        const updatedAddress = await Customer.findByIdAndUpdate(user.id, {
          address
        })

        console.log(updatedAddress);
        return {
          success: true
        }

      } catch (error) {
        if (error instanceof Error)
          throw new Error(error.message)
      }

    }

  }
};

export default customerRresolver