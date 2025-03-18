import gql from "graphql-tag"

const globalTypeDef = gql`
    type ReturnType {
        success: Boolean!
        message: String
        value:String
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
    
  type Query {
    getAuthStatus: getAuthStatusPayload
  }
scalar Upload
  `

export default globalTypeDef