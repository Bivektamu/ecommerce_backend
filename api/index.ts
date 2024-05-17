import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import resolvers from '../schema/resolvers';
import connectDB from '../dataLayer';
import { readFileSync } from 'fs';

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const typeDefs = readFileSync("./schema/schema.graphql", {
  encoding: "utf-8"
})


const server = new ApolloServer({
  typeDefs,
  resolvers,
});


// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests



async function startServer() {
  connectDB()


  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
  });

  console.log(`🚀  Server ready at: ${url}`);

}


startServer()