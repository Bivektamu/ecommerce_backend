import gql from "graphql-tag";

const productTypeDef = gql`

    enum Color {
        BLACK,
        RED,
        GRAY,
        WHITE,
        AMBER 
    }
    enum Size {
        S,
        M,
        L,
        XL
    }
    type ProductImg {
        id:ID!
        url:String!
        fileName:String!
    }
   
    type Product {
        id: ID!,
        title: String!,
        slug: String!,
        description: String!,
        colors: [Color!]!,
        sizes: [Size!]!,
        price: Int!,
        quantity: Int!,
        imgs:[ProductImg!]!,
        category:String!,
        sku: String!,
        stockStatus: Boolean!,
        featured: Boolean!
    }

    input inputProductImg {
        id:ID!,
        img:Upload!
    }

    input CreateProduct {
        title: String!,
        slug: String!,
        description: String!,
        colors: [Color!]!,
        sizes: [Size!]!,
        price: Int!,
        quantity: Int!,
        category:String!,
        sku: String!,
        stockStatus: Boolean!,
        featured: Boolean!,
        imgs:[inputProductImg!]!,
    }

    type Query {
        products: [Product],
        product(id:ID): Product,
    }

    type Mutation {
        createProduct(input:CreateProduct): ReturnType
        deleteProduct(id: ID): ReturnType
    }
`

export default productTypeDef