import gql from "graphql-tag";

const customerTypeDef = gql`

 type Address {
        street: String,
        city: String,
        postcode: String,
        state: String,
        country: String,
    }


    enum UserRole {
        admin,
        customer
    }


    type Customer {
        id: ID!,
        firstName: String!,
        lastName: String!,
        email:String!,
        address: Address,
        role: UserRole
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
        postcode: String!,
        state: String!,
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
        updateAddress(input: AddressInput): Address
    }
`

export default customerTypeDef