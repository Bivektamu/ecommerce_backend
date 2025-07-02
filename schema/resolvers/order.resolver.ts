

const orderResolver = {
    Query: {
        orders: async(parent:any, args: any, context: any) => {
            return 'Order Sample'
        },
    },
    Mutation: {
        createOrder: async(parent: any, args: any, context: any) => {
            console.log(args.input);
            
            return 'asdafads'
        }
    }
}

export default orderResolver