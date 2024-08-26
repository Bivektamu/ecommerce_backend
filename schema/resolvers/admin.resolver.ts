import { SignOptions, sign } from 'jsonwebtoken'
const adminRresolver = {

  Mutation: {
    logInAdmin: async (parent: any, args: any) => {
      const { email, password } = args.input


      // if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      if (email === 'admin@gmail.com' && password === 'password123') {
        console.log('ADMIN_EMAIL', process.env.ADMIN_EMAIL);
        console.log('MONGO_URI', process.env.MONGO_URI);
        console.log('ADMIN_ID', process.env.ADMIN_ID);
        console.log('ADMIN_PASSWORD', process.env.ADMIN_PASSWORD);
        console.log('JWTSECRET', process.env.JWTSECRET);
        
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