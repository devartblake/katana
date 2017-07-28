import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import {
  isAdminResolver,
  isAuthenticatedResolver,
  isNotAuthenticatedResolver
} from './acl.js';
import { User, View } from '../data/connectors';

const resolvers = `
    Query: {
    allUsers: (_, parent, args, { models }) => models.User.findAll(),
    me: (_, parent, args, { models, user }) => {
      if (user) {
        // they are logged in
        return models.User.findOne({
          where: {
            id: user.id,
          },
        });
      }
      // not logged in user
      return null;
    },
    Mutation: {
    updateUser: (parent, { username, newUsername }, { models }) =>
      models.User.update({ username: newUsername }, { where: { username } }),
    deleteUser: (parent, args, { models }) =>
      models.User.destroy({ where: args }),    
    register: async (parent, args, { models }) => {
      const user = args;
      user.password = await bcrypt.hash(user.password, 12);
      return models.User.create(user);
    },
    login: async (parent, { email, password }, { models, SECRET }) => {
      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Not user with that email');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Incorrect password');
      }

      // token = '12083098123414aslkjdasldf.asdhfaskjdh12982u793.asdlfjlaskdj10283491'
      // verify: needs secret | use me for authentication
      // decode: no secret | use me on the client side
      const token = jwt.sign(
        {
          user: _.pick(user, ['id', 'username']),
        },
        SECRET,
        {
          expiresIn: '1y',
        },
      );

      return token;
    }  
`;

const allUsers = isAuthenticatedResolver.createResolver(
  (root, args, context) => {
    const { user } = context;
    return user;
  }
);

const register = isNotAuthenticatedResolver.createResolver(
  async (root, args, context) => {
    const { models: {UserModel }} = context;
    const { name, email, password } = args;
    const user = await UserModel.register({
      name, 
      email,
      password
    });

    context.user = user;

    return user;
  }
);

const login = isNotAuthenticatedResolver.createResolver(
  async (root, args, context) => {
    const { models: { UserModel }} = context;
    const { email, password } = args;

    const user = await UserModel.login({
      email,
      password
    });
  }
);

export default resolvers;