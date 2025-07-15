import gql from "graphql-tag";

const authTypeDef = gql`
    type Token {
      token: String
    }
    
    type getAuthStatusPayload {
      isLoggedIn: Boolean!,
      user:User
    }

  type Mutation {
    logInAdmin(input: LogInInput!): Token,
    logInCustomer(input: LogInInput!): Token
  }

   type Query {
    getAuthStatus: getAuthStatusPayload
  }
`
export default authTypeDef