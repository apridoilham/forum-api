const UsersHandler = require('./handler');

const users = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container);

    server.route([
      {
        method: 'POST',
        path: '/users',
        handler: usersHandler.postUserHandler,
        options: {
          tags: ['api'],
        },
      },
    ]);
  },
};

module.exports = users;
