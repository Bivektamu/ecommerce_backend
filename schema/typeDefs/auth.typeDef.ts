import gql from "graphql-tag";

const authTypeDef = gql`
    type Token {
      token: String
    }
  type Mutation {
    logInAdmin(input: LogInInput!): Token,
    logInCustomer(input: LogInInput!): Token
  }
`
export default authTypeDef