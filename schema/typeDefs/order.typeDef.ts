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
        userId: ID!,
        status:Status!,
        total: Float!,
        subTotal: Float!,
        tax: Float!,
        items: [OrderItem!]!,
        shippingAddress: Address!
        orderPlaced: Date!
    }

    
    input OrderInput {
        userId: ID!,
        status:Status!,
        total: Float!,
        subTotal: Float!,
        tax: Float!,
        items: [OrderItemInput!]!,
        shippingAddress: AddressInput!
    }

    type Query {
        orders: [Order]
        customerOrders(id:ID): [Order]
        orderByNumber(orderNumber:String): Order
    }
    type Mutation {
        createOrder(input: OrderInput): String
    }
`

export default orderTypeDef