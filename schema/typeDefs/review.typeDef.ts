import gql from "graphql-tag"

const reviewTypeDef = gql`

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
`

export default reviewTypeDef