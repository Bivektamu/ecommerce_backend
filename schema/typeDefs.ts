const typeDefs = `
  type Customer {
    id: ID,
    firstName: String,
    lastName: String,
    

  }
  
  type Query {
    customers: [Customer],
    customer(id:ID): Customer,
  }
`;

export default typeDefs