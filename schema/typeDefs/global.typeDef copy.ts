import gql from "graphql-tag"

const globalTypeDef = gql`
    type ReturnType {
        success: Boolean!
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
scalar Upload
input Img {
  file:Upload!
}   
type ImgUrl {
  url:String!
}
scalar Upload
  type Mutation {
    uploadFile(input:Img!):ImgUrl!
  }
    
  `

export default globalTypeDef