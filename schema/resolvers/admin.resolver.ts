import { SignOptions, sign } from 'jsonwebtoken'
const adminRresolver = {

  Mutation: {
    logInAdmin: async (parent: any, args: any) => {
      const { email, password } = args.input


      // if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const payload = {
          admin: {
            id: process.env.ADMIN_ID
          }
        }

        const signOptions: SignOptions = {
          expiresIn: 360000
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

  }
};

export default adminRresolver