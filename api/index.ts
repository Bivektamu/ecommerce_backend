import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import {graphqlUploadExpress} from "graphql-upload-ts";
import cors from 'cors'
import http from 'http';


import resolvers from '../schema/resolvers/index.resolver';

import connectDB from '../dataLayer';
import typeDefs from '../schema/typeDefs/index.typeDef'
import verifyUser from '../utilities/verifyUser';
import { CustomJwtPayload, MyContext } from '../typeDefs';


const app = express();


app.use(express.static('public'))
app.use(graphqlUploadExpress({
  overrideSendResponse: false 
}));

const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: true,
});

async function startServer() {
  connectDB()

  await server.start();

  app.use('/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token:req.headers.token }),
    }));

    await new Promise<void>((resolve) => httpServer.listen({ port: 3000 }, resolve));
    console.log(`🚀 Server ready`);

  // const { url } = await startStandaloneServer(server, {
  //   listen: { port: 3000 },
  //   context: async ({ req, res }) => {

  //     const token = req.headers.token || ''

  //     if (token) {
  //       const user: CustomJwtPayload | null = verifyUser(token as string)

  //       if (user && user.admin) {
  //         return { admin: user.admin }
  //       }
  //     }
  //     return {}
  //   },
  // });

  // console.log(`🚀  Server ready at: ${url}`);

}

startServer()