import gql from "graphql-tag"

const reviewTypeDef = gql`

    type Review {
        id: ID!,
        userId: ID!,
        productId: ID!,
        rating: Int!,
        review: String!,
        createdAt:Date!,
        updateAt: Date
    }
    
    type Query {
        productReviews(id: ID): [Review]
    }

    input CreateReview {
        userId: ID!,
        productId: ID!,
        rating: Int!,
        review: String!
    }
    type Mutation {
        createReview(input:CreateReview):Review
    }
`

export default reviewTypeDef