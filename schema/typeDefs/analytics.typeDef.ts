import gql from "graphql-tag"


const analyticsTypeDef = gql`

enum ChangeDirection {
    INCREASE,
    DECREASE,
    NO_CHANGE
}

    type LowStockProduct {
        id: ID!,
        title: String!,
        sku: String!,
        quantity: Int!,
    }
    type CompletedOrder {
        _id:ID!
        total: Float!,
        orderPlaced: Date!,
        items: [CompletedOrderProductId!]!
    }

    type CompletedOrderProductId {
        productId: CompletedOrderProduct!
    }
type CompletedOrderProduct {
        _id:ID!
        category: String!
    }
    type YearlyStats {
        totalOrders: Int!,
        totalSales: Float,
        totalUsers: Int!,
    }
    type PercentageChange {
        changeBy: Int,
        changeDirection: ChangeDirection
    }

    type OrderItemsCategoryCounter {
        cat: String!,
        count: Int!
    }
    
    type SalesAnalytics {
        sales: Float!,
        changeInSales: Float!
    }
    type OrderAnalytics {
        totalOrders: Int!,
        totalSales: Float!,
        monthlyOrders:[CompletedOrder]!,
        changeInOrders: Float!,
        changeInSales: Float!,
        orderByCategory: [OrderItemsCategoryCounter]
    }

    type Query {
        yearlyStats: YearlyStats
        orderAnalytics: OrderAnalytics
        salesAnalytics: SalesAnalytics
        totalLowStockProducts: [LowStockProduct],
    }

`
export default analyticsTypeDef