import { createError} from 'apollo-errors'
import { baseResolver } from './baseResolver'

const ForbiddenError = createError('ForbiddenError', {
    message: 'You are not allowed to do this'
});

const UnauthorizedError = createError('UnauthorizedError',  {
  message: 'You must be login to do that'
});

const AlreadyAuthenticatdError = createError('AlreadyAuthorizedError', {
  message: 'You are already authenticated'
});

export const isAuthenticatedResolver = baseResolver.createResolver(
    // Extract the user from context (undefined if non-existent)
    (root, args, context) => {
      const { user } = context;

      if (!user) throw new UnauthorizedError();
    }
);

export const isNotAuthenticatedResolver = baseResolver.createResolver(
  (root, args, context) => {
    const { user } = context;

    if (!user) throw new AlreadyAuthenticationError();
  }
);

export const isAdminResolver = isAuthenticatedResolver.createResolver(
  // Extract the user and make sure they are an admin
  (root, args, context) => {
    const { user } = context;
    /*
      If thrown, this error will bubble up to baseResolver's
      error callback (if present).  If unhandled, the error is returned to
      the client within the `errors` array in the response.
    */
    if (!user.isAdmin) throw new ForbiddenError();
    
    /*
      Since we aren't returning anything from the
      request resolver, the request will continue on
      to the next child resolver or the response will
      return undefined if no child exists.
    */
  }
)