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
        total: Float!,
        orderPlaced: Date!,
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
    
    type MonthlyStats {
        currentMonthOrders: [CompletedOrder],
        changeInOrders: PercentageChange,
        changeInSales: PercentageChange,
        changeInUsers: PercentageChange,
    }
    type Query {
        yearlyStats: YearlyStats
        monthlyStats: MonthlyStats
        totalLowStockProducts: [LowStockProduct],
    }

`
export default analyticsTypeDef