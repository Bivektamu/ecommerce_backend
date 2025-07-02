import gql from "graphql-tag";

const orderTypeDef = gql`
enum Status {
    PENDING,
    COMPLETED,
    PROCESSING,
    CANCELLED,
    FAILED,
    SHIPPED,
    REFUNDED
}

    type OrderItem {
        productId: ID!,
        color: Color!,
        quantity: Int!,
        size: Size!,
        price: Int!,
        imgUrl: String!
    }

    input OrderItemInput {
        productId: ID!,
        color: Color!,
        quantity: Int!,
        size: Size!,
        price: Int!,
        imgUrl: String!
    }
    type Order {
        id: ID!,
        userId: ID!,
        status:Status!,
        total: Int!,
        items: [OrderItem!]!,
        shippingAddress: Address!
    }

    
    input OrderInput {
        id: ID!,
        userId: ID!,
        status:Status!,
        total: Int!,
        items: [OrderItemInput!]!,
        shippingAddress: AddressInput!
    }

    type Query {
        orders: String
    }
    type Mutation {
        createOrder(input: OrderInput): String
    }
`

export default orderTypeDef