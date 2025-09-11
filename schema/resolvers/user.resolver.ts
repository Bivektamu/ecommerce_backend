import User from "../../dataLayer/schema/User";
import { Address, ErrorCode, FormError, UserRole, ValidateSchema } from "../../typeDefs";
import validateForm from "../../utilities/validateForm";
import bcrypt from 'bcrypt'
import verifyUser from "../../utilities/verifyUser";
import { GraphQLError } from "graphql";

const userRresolver = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      if (!context.token) {
        throw new Error(ErrorCode.NOT_AUTHENTICATED)
      }
      const user = verifyUser(context.token)
      if (user?.role !== UserRole.ADMIN) {
        throw new Error(ErrorCode.NOT_AUTHENTICATED)
      }
      const users = await User.find()
      return users
    },
    user: async (parent: any, args: any, context: any) => {

      if (!context.token) {
        throw new Error(ErrorCode.NOT_AUTHENTICATED)
      }
      const user = verifyUser(context.token)
      if (!user) {
        throw new Error(ErrorCode.NOT_AUTHENTICATED)
      }
      const id = args.id

      const findUser = await User.findById(id)
      return findUser
    },
    userEmail: async (parent: any, args: any) => {
      const id = args.id
      const finduser = await User.findById(id)
      if (!finduser) {
        throw new Error(ErrorCode.NOT_FOUND)
      }
      return finduser.email
    },

  },
  Mutation: {
    createUser: async (parent: any, args: any) => {
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

      const userExists = await User.findOne({ email: email.toLowerCase() })
      if (userExists) {
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

    deleteUser: async (parent: any, args: any, context: any) => {
      try {

        if (!context.token) {
          throw new Error(ErrorCode.NOT_AUTHENTICATED)
        }
        const user = verifyUser(context.token)
        if (!user) {
          throw new Error(ErrorCode.NOT_AUTHENTICATED)
        }

      const { id } = args

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
        throw new Error(ErrorCode.NOT_AUTHENTICATED)
      }

      const user = verifyUser(context.token)
      if (!user || user.role !== UserRole.CUSTOMER) {
        throw new Error(ErrorCode.NOT_AUTHENTICATED)
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
      const finduser = await User.findById(user.id)
      if (!finduser) {
        throw new Error(ErrorCode.USER_NOT_FOUND)
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
        else throw new Error(ErrorCode.INTERNAL_SERVER_ERROR)

      } catch (error) {
        if (error instanceof Error)
          throw new Error(error.message)
      }

    },
    updateAccount: async (parent: any, args: any, context: any) => {
      try {

        if (!context.token) {
          throw new Error(ErrorCode.NOT_AUTHENTICATED)
        }

        const user = verifyUser(context.token)
        if (!user || user.role !== UserRole.CUSTOMER) {
          throw new Error(ErrorCode.NOT_AUTHENTICATED)
        }

        const { firstName, lastName, email } = args.input

        const validateSchema: ValidateSchema<any>[] = [
          { value: firstName, name: 'firstName', type: 'string' },
          { value: lastName, name: 'lastName', type: 'string' },
          { value: email, name: 'email', type: 'email' },
        ]

        const errors: FormError = validateForm(validateSchema)

        if (Object.keys(errors).length > 0) {
          throw new Error(JSON.stringify(errors))
        }
        const finduser = await User.findById(user.id)
        if (!finduser) {
          throw new Error(ErrorCode.USER_NOT_FOUND)
        }

        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          {
            firstName,
            lastName,
            email
          },
          { new: true }
        )

        return updatedUser
      } catch (error) {
        if (error instanceof Error)
          throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
      }

    }

  }
};

export default userRresolver