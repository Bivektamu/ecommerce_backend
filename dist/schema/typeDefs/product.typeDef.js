"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
// input EditProduct {
//     newImgs:[inputProductImgWithUrl!],
// }
const productTypeDef = (0, graphql_tag_1.default) `

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

    // input inputProductImg {
    //     _id:ID!,
    //     img:Upload!
    // }

    //  input inputProductImgWithUrl {
    //     id:ID!
    //     url:String!
    //     fileName:String!
    // }

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

    input EditProduct {
        id:ID!,
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
        oldImgs:[inputProductImgWithUrl!],
        newImgs:[inputProductImg!],
    }

    type Query {
        products: [Product],
        product(id:ID): Product,
    }

    type Mutation {
        createProduct(input:CreateProduct): Product
        deleteProduct(id: ID): ReturnType
        editProduct(input:EditProduct): Product

    }
`;
exports.default = productTypeDef;
