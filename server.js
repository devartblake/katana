import express from 'express';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import { graphqlExpress, graphiqlExpress }  from 'apollo-server-express';
import { createExpressContext } from 'apollo-resolvers';
// import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { formatError as apolloFormatError, createError } from 'apollo-errors';

import schema from './data/schema';
import mocks from './data/mocks';
import resolvers from './core/resolvers';
// import models from './models';

const UnknownError = createError('UnknownError', {
  message: 'An unknown error has occurred.  Please try again later'
});

const formatError = error => {
  let e = apolloFormatError(error);

  if (e instanceof GraphQLError) {
    e = apolloFormatError(new UnknownError({
      data: {
        originalMessage: e.message,
        originalError: e.name
      }
    }));
  }

  return e;
};

const GRAPHQL_PORT = 3000;
const SECRET = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd';
const graphQLServer = express();

const auth = async (req, res, next) =>{
  if (req.cookies.token) {
    req.user = await models.User.Authenticate(req.cookies.token);
  } else {
    req.user = null;
  }
  next();
};

graphQLServer.use((req, res, next) => {
    req.user = null; // fetch the user making the request if desired
    next();
});
graphQLServer.use('/graphql',
  cookieParser(),
  json(),
  auth,
  graphqlExpress((req, res) => {
  schema;
  mocks;
  // const user = req.user;
  // const models = {
  //   User: new UserModel(user)
  // };

  const context = createExpressContext({
    //models, 
    SECRET, 
    //user 
  }, res);

  return {
    schema, 
    formatError, // Error formatting via apollo-errors
    context // Our resolver context
    };
}));

graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
));

export default graphQLServer;