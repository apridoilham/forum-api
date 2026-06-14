const LikesHandler = require('./handler');

const likes = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { container }) => {
    const likesHandler = new LikesHandler(container);

    server.route([
      {
        method: 'PUT',
        path: '/threads/{threadId}/comments/{commentId}/likes',
        handler: likesHandler.putLikeHandler,
        options: {
          auth: 'forumapi_jwt',
          tags: ['api'],
        },
      },
    ]);
  },
};

module.exports = likes;
