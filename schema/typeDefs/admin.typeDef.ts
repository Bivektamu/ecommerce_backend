import gql from "graphql-tag";

const adminTypeDef = gql`
    type Token {
      token: String
    }
  
    type Admin {
        id: ID
        firstName: String
        lastName: String
        email: String
        password: String
    }
  input CreateAdminInput {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  type Mutation {
    logInAdmin(input: SignInInput!): Token
  }
`
export default adminTypeDef