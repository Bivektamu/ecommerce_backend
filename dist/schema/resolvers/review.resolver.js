"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Review_1 = __importDefault(require("../../dataLayer/schema/Review"));
const graphql_1 = require("graphql");
const typeDefs_1 = require("../../typeDefs");
const verifyUser_1 = __importDefault(require("../../utilities/verifyUser"));
const validateForm_1 = __importDefault(require("../../utilities/validateForm"));
const DateScalar = new graphql_1.GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        // Convert outgoing Date to ISO string
        return value.toISOString();
    },
    parseValue(value) {
        // Convert incoming ISO string to Date
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return new Date(ast.value); // Convert hard-coded string to Date
        }
        return null;
    },
});
const reviewResolver = {
    Date: DateScalar,
    Query: {
        reviewsByProductId: async (parent, args) => {
            const productId = args.id;
            const reviews = await Review_1.default.find({ productId });
            return reviews;
        }
    },
    Mutation: {
        createReview: async (parentparent, args, context) => {
            if (!context.token) {
                throw new Error('Not Authenticated');
            }
            const user = (0, verifyUser_1.default)(context.token);
            if (!user || user.role !== typeDefs_1.User.CUSTOMER) {
                throw new Error('Not Authenticated');
            }
            const { rating, productId, customerId, review } = args.input;
            const validateSchema = [
                { value: rating, name: 'rating', type: 'number' },
                { value: productId, name: 'productId', type: 'string' },
                { value: customerId, name: 'customerId', type: 'string' },
                { value: review, name: 'review', type: 'string' },
            ];
            const errors = (0, validateForm_1.default)(validateSchema);
            if (Object.keys(errors).length > 0) {
                throw new Error(JSON.stringify(errors));
            }
            const newReview = new Review_1.default({
                rating,
                productId,
                customerId,
                review
            });
            return await newReview.save();
        }
    }
};
exports.default = reviewResolver;
