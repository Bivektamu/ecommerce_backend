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
        orderNumber: String!,
        customerId: ID!,
        status:Status!,
        total: Float!,
        subTotal: Float!,
        tax: Float!,
        items: [OrderItem!]!,
        shippingAddress: Address!
    }

    
    input OrderInput {
        customerId: ID!,
        status:Status!,
        total: Float!,
        subTotal: Float!,
        tax: Float!,
        items: [OrderItemInput!]!,
        shippingAddress: AddressInput!
    }

    type Query {
        orders: String
        customerOrders(id:ID): [Order]
    }
    type Mutation {
        createOrder(input: OrderInput): String
    }
`

export default orderTypeDef