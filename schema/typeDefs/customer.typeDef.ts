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

    input AddressInput {
        street: String!,
        city: String!,
        zipcode: Int,
        country: String!,
    }

    type CustomerName {
        firstName: String,
        lastName: String,
    }

    type Query {
        customers: [Customer],
        customer(id:ID): Customer,
        customerEmail(id:ID): String,
        customerName(id:ID): CustomerName
    }

    type Mutation {
        createCustomer(input:CustomerInput): Customer,
        deleteCustomer(id: ID): ReturnType,
        updateAddress(input: AddressInput): ReturnType
    }
`

export default customerTypeDef