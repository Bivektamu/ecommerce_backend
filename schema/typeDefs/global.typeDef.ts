import gql from "graphql-tag"

const globalTypeDef = gql`
    scalar Date
    scalar Upload

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
    
 
  `

export default globalTypeDef