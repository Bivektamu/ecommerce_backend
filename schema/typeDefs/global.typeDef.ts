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
    
    type getAuthStatusPayload {
      isLoggedIn: Boolean!,
      userRole: String
    }
    
  type Query {
    getAuthStatus: getAuthStatusPayload
  }
scalar Upload
  `

export default globalTypeDef