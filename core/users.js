import { isAuthenticatedResolver } from './acl';
import { createError } from 'apollo-errors';

const NotYourUserError = createError('NotYourUserError', {
    message: 'You cannot update the profile for other users'
});

const updateMyProfile = isAuthenticatedResolver.createResolver(
    (root, args, context) => {
        const  { user, models: { UserModel }} = context;
        const { name, email } = args;

        /*
      If thrown, this error will bubble up to isAuthenticatedResolver's error callback
      (if present) and then to baseResolver's error callback.  If unhandled, the error
      is returned to the client within the `errors` array in the response.
    */
        if (!user.isAdmin && input.id !== user.id) throw new NotYourUserError();
        return UserModel.update(userr, {
            name, 
            email
        });
    }
);

export default {
    Mutation: { 
        updateMyProfile
    }
};