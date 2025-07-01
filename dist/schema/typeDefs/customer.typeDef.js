"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const customerTypeDef = (0, graphql_tag_1.default) `
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
`;
exports.default = customerTypeDef;
