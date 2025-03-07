import gql from "graphql-tag";

const customerTypeDef = gql`
    type Customer {
        id: ID,
        firstName: String,
        lastName: String,
        email:String,
        password: String
    }

    input CustomerInput {
        firstName: String!,
        lastName: String!,
        email:String!,
        password: String!
    }

    type Query {
        customers: [Customer],
        customer(id:ID): Customer,
        customerEmail(id:ID): String
    }

    type Mutation {
        createCustomer(input:CustomerInput): Customer
        deleteCustomer(id: ID): ReturnType
    }
`

export default customerTypeDef