import casual from 'casual';

const mocks = {
  String: () => 'It works!',
  Query: () => ({
    id: () => 'Int',
    user: (root, args) => {
      return { id: args.id, firstName: args.firstName, lastName: args.lastName}
    },
  }),
  User: () => ({
    id: () => casual.id,
    firstName: () => casual.first_name,
    lastName: () => casual.last_name
  }),
};

export default mocks;