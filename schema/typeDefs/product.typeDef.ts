import gql from "graphql-tag";

const productTypeDef = gql`

    enum Color {
        BLACK,
        RED,
        GRAY,
        WHITE,
        AMBER 
    }
    type Product {
        id: ID,
        title: String,
        slug: String,
        description: String,
        password: String,
        colors: [Color],
        price: Number,
        quantity: Number,
        sku: String,
        stockStatus: Boolean,
        featured: Boolean
    }

    input CreateProduct {
        title: String,
        slug: String,
        description: String,
        colors: [Color],
        price: Number,
        quantity: Number,
        sku: String,
        stockStatus: Boolean,
        featured: Boolean
    }

    type Query {
        products: [Product],
        product(id:ID): Product,
    }

    type Mutation {
        createProduct(input:Createproduct): Product
        deleteProduct(id: ID): ReturnType
    }
`

export default productTypeDef