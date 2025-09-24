import Order from "../../dataLayer/schema/Order"
import User from "../../dataLayer/schema/User"
import { ChangeDirection, ErrorCode, OrderStatus, UserRole } from "../../typeDefs"
import verifyUser from "../../utilities/verifyUser"

const analyticsResolver = {
    Query: {
        yearlyStats: async (parent: any, args: any, context: any) => {
            try {
                if (!context.token) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }
                const user = verifyUser(context.token)

                if (!user) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }

                if (!user || user?.role !== UserRole.ADMIN) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }
                let startFiscalDate
                const currentYear = (new Date()).getFullYear()

                const currentMonth = (new Date()).getMonth() + 1
                if (currentMonth >= 7) {
                    startFiscalDate = new Date(currentYear, 7, 1)
                }
                else {
                    startFiscalDate = new Date(currentYear - 1, 7, 1)
                }

                const endFiscalDate = new Date()

                const orders = await Order.find({
                    orderPlaced: {
                        $gte: startFiscalDate,
                        $lte: endFiscalDate
                    },
                    status: OrderStatus.COMPLETED
                }).select('total')

                const users = await User.find({
                    registeredDate: {
                        $gte: startFiscalDate,
                        $lte: endFiscalDate
                    }
                }).select('id')

                const yearlyStats = {
                    totalOrders: orders.length,
                    totalSales: orders.reduce((sum, order) => sum + order.total, 0),
                    totalUsers: users.length
                }

                return yearlyStats

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }

        },
        monthlyStats: async (parent: any, args: any, context: any) => {
            try {
                // if (!context.token) {
                //     throw new Error(ErrorCode.NOT_AUTHENTICATED)
                // }
                // const user = verifyUser(context.token)

                // if (!user) {
                //     throw new Error(ErrorCode.NOT_AUTHENTICATED)
                // }

                // if (!user || user?.role !== UserRole.ADMIN) {
                //     throw new Error(ErrorCode.NOT_AUTHENTICATED)
                // }




                const now = new Date()
                const currentYear = (now).getUTCFullYear()

                const currentMonth = (now).getUTCMonth()

                const startDate = new Date(Date.UTC(currentYear, currentMonth, 1))
                const endDate = new Date(Date.UTC(currentYear, currentMonth, now.getDate()))


                const currentMonthOrders = await Order.find({
                    orderPlaced: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    status: OrderStatus.COMPLETED
                }).select('total orderPlaced category')

                console.log(currentMonthOrders)

                const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
                const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

                const previousMonthstartDate = new Date(Date.UTC(previousYear, previousMonth, 1))
                const previousMonthendDate = new Date(Date.UTC(previousYear, previousMonth + 1, 0))

                console.log(previousMonthstartDate, previousMonthendDate)
                const lastMonthOrders = await Order.find({
                    orderPlaced: {
                        $gte: previousMonthstartDate,
                        $lte: previousMonthendDate
                    },
                    status: OrderStatus.COMPLETED
                }).select('total')

                let change = {
                    changeBy: 100,
                    changeDirection: ChangeDirection.INCREASE
                }
                if (currentMonthOrders.length > 0 && lastMonthOrders.length > 0) {
                    const percent = ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100

                    change.changeBy = percent

                    if (percent > 0) {
                        change.changeDirection = ChangeDirection.INCREASE
                    }
                    else if (percent < 0) {
                        change.changeDirection = ChangeDirection.DECREASE
                    }
                    else {
                        change.changeDirection = ChangeDirection.NO_CHANGE
                    }
                  
                }
                else if (currentMonthOrders.length  < 1 ) {
                    change = {
                        changeBy: 0,
                        changeDirection: ChangeDirection.NO_SALES
                    }
                }

                console.log(change)
                throw new Error('working')

                // const monthlyStats = {
                //     currentMonthOrders,
                //     changeInOrders: 
                // }


                const currentMonthUsers = await User.find({
                    registeredDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }).select('id')




                // return yearlyStats

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }

        }
    }
}

export default analyticsResolver