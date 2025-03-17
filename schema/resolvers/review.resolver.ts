import { Query } from "mongoose";
import Review from "../../dataLayer/schema/Review";
import { GraphQLScalarType, Kind } from "graphql"

import { FormError, ReviewType, User, ValidateSchema } from "../../typeDefs";
import verifyUser from "../../utilities/verifyUser";
import validateForm from "../../utilities/validateForm";

const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value: any) {
        // Convert outgoing Date to ISO string
        return value.toISOString();
    },
    parseValue(value: any) {
        // Convert incoming ISO string to Date
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value); // Convert hard-coded string to Date
        }
        return null;
    },
});
const reviewResolver = {
    Date: DateScalar,
    Query: {
        reviewsByProductId: async (parent: any, args: any) => {
            const productId = args.id
            const reviews = await Review.find({ productId })
            return reviews
        }
    },
    Mutation: {
        createReview: async (parentparent: any, args: any, context: any) => {


            if (!context.token) {
                throw new Error('Not Authenticated')
            }



            const user = verifyUser(context.token)

            if (!user || user.role !== User.CUSTOMER) {
                throw new Error('Not Authenticated')
            }

            const { rating, productId, customerId, review } = args.input

            const validateSchema: ValidateSchema<any>[] = [
                { value: rating, name: 'rating', type: 'number' },
                { value: productId, name: 'productId', type: 'string' },
                { value: customerId, name: 'customerId', type: 'string' },
                { value: review, name: 'review', type: 'string' },
            ]

            const errors: FormError = validateForm(validateSchema)
            if (Object.keys(errors).length > 0) {
                throw new Error(JSON.stringify(errors))
            }

            const newReview = new Review({
                rating,
                productId,
                customerId,
                review
            })

            return await newReview.save()


        }
    }
}

export default reviewResolver