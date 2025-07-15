import { SignOptions, sign } from 'jsonwebtoken'
import verifyUser from '../../utilities/verifyUser';
import { CustomJwtPayload, ErrorCode, FormError, UserRole, ValidateSchema } from '../../typeDefs';
import validateForm from '../../utilities/validateForm';
import User from '../../dataLayer/schema/User';
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql';
const authResolver = {
  Mutation: {
    logInAdmin: async (parent: any, args: any, context: any) => {

      const { email, password } = args.input

      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const payload:CustomJwtPayload = {
            role: UserRole.ADMIN,
            id: process.env.ADMIN_ID as string
        }

        const signOptions: SignOptions = {
          expiresIn: '1h'
        }
        const secret: string = process.env.JWTSECRET as string

        const token = sign(
          payload,
          secret,
          signOptions
        );

        return {
          token
        }
      }
      else {
        throw new Error('Bad Credentials')
      }

    },
    logInCustomer: async (parent: any, args: any, context: any) => {

      const { email, password } = args.input

      const validateSchema: ValidateSchema<any>[] = [
        { value: email, name: 'email', type: 'email' },
        { value: password, name: 'password', type: 'string' },
      ]
      const errors: FormError = validateForm(validateSchema)
      if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors))
      }

      const user = await User.findOne({ email: email.toLowerCase() })

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: ErrorCode.USER_NOT_FOUND
          }
        })
      }

      if(user.role !== UserRole.CUSTOMER) {
        throw new Error('Wrong User type')
      }

      const isMatched = bcrypt.compareSync(password, user.password)

      if (!isMatched) {
        throw new Error('Bad Credentials')
      }

      console.log(isMatched)

      const payload:CustomJwtPayload = {
        role: UserRole.CUSTOMER,
        id: user.id
      }

      const signOptions: SignOptions = {
        expiresIn: '1h'
      }
      const secret: string = process.env.JWTSECRET as string

      const token = sign(
        payload,
        secret,
        signOptions

      );

      return {
        token
      }

    },

  },
  Query: {
    getAuthStatus: (parent: any, args: any, context: any) => {

      if (!context.token) {
        return { isLoggedIn: false }
      }
      const user = verifyUser(context.token)
      if (!user) {
        return { isLoggedIn: false, user: null }
      }


      return { isLoggedIn: true, user:user }
    }
  },
};

export default authResolver