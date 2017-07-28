import { createError, isInstance } from 'apollo-errors';
import { isAuthenticatedResolver, isAdminResolver } from './acl';

const ExposedError = createError('ExposedError', {
  message: 'An unknown error has occurred'
});

const banUser = isAdminResolver.createResolver(
  (root, args, context ) => {
    const { models: { UserModel }} = context;
    const { id } = args;
    
    /*
      For admin users, let's tell the user what actually broke
      in the case of an unhandled exception
    */
    return UserModel.ban(id);
    }
);

export default {
  Mutation: {
    banUser
  }
};