import { SignOptions, sign } from 'jsonwebtoken'
import verifyUser from '../../utilities/verifyUser';
import { FormError, User, UserRole, ValidateSchema } from '../../typeDefs';
import validateForm from '../../utilities/validateForm';
import Customer from '../../dataLayer/schema/Customer';
import bcrypt from 'bcrypt'
const authResolver = {
  Mutation: {
    logInAdmin: async (parent: any, args: any, context: any) => {

      const { email, password } = args.input

      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const payload:UserRole = {
            userRole: User.ADMIN,
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
        { value: password, name: 'password', type: 'password' },
      ]
      const errors: FormError = validateForm(validateSchema)
      if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors))
      }

      const user = await Customer.findOne({ email: email.toLowerCase() })
      if (!user) {
        throw new Error('Bad Credentials')
      }

      const isMatched = bcrypt.compareSync(password, user.password)

      if (!isMatched) {
        throw new Error('Bad Credentials')
      }

      const payload:UserRole = {
        userRole: User.CUSTOMER,
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
        return { isLoggedIn: false, userRole: null }
      }


      return { isLoggedIn: true, userRole: JSON.stringify(user) }
    }
  },
};

export default authResolver