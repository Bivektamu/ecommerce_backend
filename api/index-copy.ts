import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import resolvers from '../schema/resolvers/index.resolver';
import connectDB from '../dataLayer';
import typeDefs from '../schema/typeDefs/index.typeDef'
import verifyUser from '../utilities/verifyUser';
import { CustomJwtPayload, MyContext } from '../typeDefs';


const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  introspection: true,
});

async function startServer() {
  connectDB()

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: async ({ req, res }) => {

      const token = req.headers.token || ''

      if (token) {
        const user: CustomJwtPayload | null = verifyUser(token as string)
        
        if (user && user.admin) {
          return { admin: user.admin }
        }
      }
        return {}
    },
  });

  console.log(`🚀  Server ready at: ${url}`);

}

startServer()