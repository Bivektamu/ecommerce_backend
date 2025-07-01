"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const globalTypeDef = (0, graphql_tag_1.default) `
    type ReturnType {
        success: Boolean!
        message: String
        value:String
    }
    
    
    input LogInInput {
      email:String!,
      password: String!
    }

    type User {
      role: String!,
      id: ID!
    }
    
    type getAuthStatusPayload {
      isLoggedIn: Boolean!,
      user:User
    }
    
  type Query {
    getAuthStatus: getAuthStatusPayload
  }
  `;
exports.default = globalTypeDef;
