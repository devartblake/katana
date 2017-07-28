import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';
import mocks from './mocks';
import { resolvers } from '../core/resolvers';

const typeDefs = `
type User {
  id: Int!
  username: String!
  firstName: String!
  lastName: String!
  email: String!
  createdAt: String!
  UpdateAt: String!
},

type Query {
  allUsers: [User!]!
  getUser(username: String!, firstName: String!, lastName: String!): User
},
schema {
  query: Query
},

type Mutation {
  createUser(username: String!): User
  updateUser(username: String!, newUsername: String!): [Int!]!
  deleteUser(username: String!): Int!
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

addMockFunctionsToSchema({ schema, mocks });

export default schema;