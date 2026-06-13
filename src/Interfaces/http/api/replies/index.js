const RepliesHandler = require('./handler');

const replies = {
  name: 'replies',
  version: '1.0.0',
  register: async (server, { container }) => {
    const repliesHandler = new RepliesHandler(container);

    server.route([
      {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: repliesHandler.postReplyHandler,
        options: {
          auth: 'forumapi_jwt',
        },
      },
      {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        handler: repliesHandler.deleteReplyHandler,
        options: {
          auth: 'forumapi_jwt',
        },
      },
    ]);
  },
};

module.exports = replies;
