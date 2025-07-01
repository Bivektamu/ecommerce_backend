"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const authTypeDef = (0, graphql_tag_1.default) `
    type Token {
      token: String
    }
  type Mutation {
    logInAdmin(input: LogInInput!): Token,
    logInCustomer(input: LogInInput!): Token
  }
`;
exports.default = authTypeDef;
