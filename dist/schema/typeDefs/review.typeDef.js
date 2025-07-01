"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const reviewTypeDef = (0, graphql_tag_1.default) `

    scalar Date
    type Review {
        id: ID!,
        customerId: ID!,
        productId: ID!,
        rating: Int!,
        review: String!,
        timeStamp: Date!
    }
    
    type Query {
        reviewsByProductId(id: ID): [Review]
    }

    input CreateReview {
        customerId: ID!,
        productId: ID!,
        rating: Int!,
        review: String!
    }
    type Mutation {
        createReview(input:CreateReview):Review
    }
`;
exports.default = reviewTypeDef;
