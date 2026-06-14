const ThreadsHandler = require('./handler');

const threads = {
  name: 'threads',
  version: '1.0.0',
  register: async (server, { container }) => {
    const threadsHandler = new ThreadsHandler(container);

    server.route([
      {
        method: 'POST',
        path: '/threads',
        handler: threadsHandler.postThreadHandler,
        options: {
          auth: 'forumapi_jwt',
          tags: ['api'],
        },
      },
      {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: threadsHandler.getThreadByIdHandler,
        options: {
          tags: ['api'],
        },
      },
    ]);
  },
};

module.exports = threads;
