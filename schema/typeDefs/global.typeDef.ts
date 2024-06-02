import gql from "graphql-tag"

const globalTypeDef = gql`
    type ReturnType {
        success: Boolean
        message: String
        value:String
    }
    
    
    input SignInInput {
      email:String,
      password: String
    }

    type AdminContext {
      id: ID
      firstName: String
      lastName: String
      email: String
  }

    type Context {
      user: String,
      admin:AdminContext
    }
    
    
    type getAuthStatusPayload {
      isLoggedIn: Boolean
    }
    
  type Query {
    getAuthStatus: getAuthStatusPayload
  }

    
  `

export default globalTypeDef