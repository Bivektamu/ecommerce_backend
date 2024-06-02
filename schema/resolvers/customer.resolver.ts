import Customer from "../../dataLayer/schema/Customer";

const customerRresolver = {
  Query: {
    customers: async () => {
      const customers = await Customer.find()
      return customers
    },
    customer: async (parent: any, args: any) => {
      const id = args.id
      const findCustomer = await Customer.findById(id)
      return findCustomer
    }
  },
  Mutation: {
    createCustomer: async (parent: any, args: any) => {
      const { email, password, firstName, lastName } = args.input
      const customerExists = await Customer.findOne({ email: email.toLowerCase() })
      if (customerExists) {
        return null
      }
      const customer = new Customer({
        firstName,
        lastName,
        email,
        password
      })

      return await customer.save()
    },
    deleteCustomer: async (parent: any, args: any) => {
      const { id } = args

      try {
        const a = await Customer.findByIdAndDelete(id)
        if (a) {
          return {
            success: true,
          }

        }
        throw new Error('User not found')
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            message: error.message
          }
        }
      }
    }
    
  }
};

export default customerRresolver