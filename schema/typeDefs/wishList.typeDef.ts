import gql from "graphql-tag";


const wishListTypeDef = gql`

    type ProductId {
        id:ID!
    }

    type WishList {
        id:ID!,
        userId:ID!,
        products:[ProductId!]!
        createdAt: Date!
    }

    input CreateWishList {
        userId:ID!,
        products:[ProductId!]!
    }
    
    type Mutation {
        createWishList(input:CreateWishList):WishList
    }
`

export default wishListTypeDef