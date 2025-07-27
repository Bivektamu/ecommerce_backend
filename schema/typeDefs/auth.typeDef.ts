import gql from "graphql-tag";

const authTypeDef = gql`
    type Token {
      token: String
    }
    input LogInInput {
      email:String!,
      password: String!
    }

    type User {
      role: String!,
      id: ID!
    }

    
    type getAuthStatusPayload {
      isLoggedIn: Boolean!,
      user:User
    }

    input ChangePassword {
      id:ID!,
      currentPassword: String!,
      newPassword: String!
    }

  type Mutation {
    logInAdmin(input: LogInInput!): Token,
    logInCustomer(input: LogInInput!): Token,
    changePassWord(input:ChangePassword):Boolean
  }

   type Query {
    getAuthStatus: getAuthStatusPayload
  }
`
export default authTypeDef