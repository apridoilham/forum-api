const pool = require('../../../../../Infrastructures/database/postgres/pool');
const LikesTableTestHelper = require('../../../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../../../tests/ServerTestHelper');
const container = require('../../../../../Infrastructures/http/container');
const createServer = require('../../../../../Infrastructures/http/createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and like the comment', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      await LikesTableTestHelper.findLikeById('like-123'); // ID auto generated, we check total instead
      const allLikes = await pool.query('SELECT * FROM comment_likes');
      expect(allLikes.rowCount).toEqual(1);
    });

    it('should response 200 and unlike the comment if already liked', async () => {
      const accessToken = await ServerTestHelper.getAccessToken(); // user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const allLikes = await pool.query('SELECT * FROM comment_likes');
      expect(allLikes.rowCount).toEqual(0);
    });

    it('should response 404 when comment not found', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-not-found/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });
  });
});
