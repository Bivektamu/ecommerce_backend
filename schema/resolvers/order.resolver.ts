import Order from "../../dataLayer/schema/Order"
import { User } from "../../typeDefs"
import verifyUser from "../../utilities/verifyUser"


const orderResolver = {
    Query: {
        orders: async (parent: any, args: any, context: any) => {
            return 'Order Sample'
        },
    },
    Mutation: {
        createOrder: async (parent: any, args: any, context: any) => {
            if (!context.token) {
                throw new Error('Not Authenticated')
            }

            const user = verifyUser(context.token)
            if (!user) {
                throw new Error('Not Authenticated')
            }

            if (user.role !== User.CUSTOMER) {
                throw new Error('Not Authenticated')
            }

            try {
                const {
                    userId,
                    status,
                    total,
                    subTotal,
                    tax,
                    items,
                    shippingAddress,
                } = args.input

                const newOrder = new Order({
                    orderNumber: Date.now() + Math.floor((Math.random() * 1000)),
                    userId,
                    status,
                    total,
                    subTotal,
                    tax,
                    items,
                    shippingAddress,
                })

                await newOrder.save()
                return newOrder.orderNumber

            } catch (error) {
                throw error

            }

        }
    }
}

export default orderResolver