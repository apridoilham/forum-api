const CommentsHandler = require('./handler');

const comments = {
  name: 'comments',
  version: '1.0.0',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);

    server.route([
      {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: commentsHandler.postCommentHandler,
        options: {
          auth: 'forumapi_jwt',
        },
      },
      {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: commentsHandler.deleteCommentHandler,
        options: {
          auth: 'forumapi_jwt',
        },
      },
    ]);
  },
};

module.exports = comments;
