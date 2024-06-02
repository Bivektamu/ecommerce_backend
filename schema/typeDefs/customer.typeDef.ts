import gql from "graphql-tag";

const customerTypeDef = gql`
    type Customer {
        id: ID,
        firstName: String,
        lastName: String,
        email:String,
        password: String
    }

    input CreateCustomer {
        firstName: String,
        lastName: String,
        email:String,
        password: String
    }

    type Query {
        customers: [Customer],
        customer(id:ID): Customer,
    }

    type Mutation {
        createCustomer(input:CreateCustomer): Customer
        deleteCustomer(id: ID): ReturnType
    }
`

export default customerTypeDef