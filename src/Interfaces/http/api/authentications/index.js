const AuthenticationsHandler = require('./handler');

const authentications = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container);

    server.route([
      {
        method: 'POST',
        path: '/authentications',
        handler: authenticationsHandler.postAuthenticationHandler,
      },
      {
        method: 'PUT',
        path: '/authentications',
        handler: authenticationsHandler.putAuthenticationHandler,
      },
      {
        method: 'DELETE',
        path: '/authentications',
        handler: authenticationsHandler.deleteAuthenticationHandler,
      },
    ]);
  },
};

module.exports = authentications;
