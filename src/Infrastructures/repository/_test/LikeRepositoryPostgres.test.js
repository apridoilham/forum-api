const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist like correctly', async () => {
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.addLike('comment-123', 'user-123');

      const likes = await LikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(1);
      expect(likes[0].comment_id).toEqual('comment-123');
      expect(likes[0].owner).toEqual('user-123');
    });
  });

  describe('removeLike function', () => {
    it('should remove like correctly', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await likeRepositoryPostgres.removeLike('comment-123', 'user-123');

      const likes = await LikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('isLiked function', () => {
    it('should return true if liked', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.isLiked('comment-123', 'user-123');
      expect(isLiked).toEqual(true);
    });

    it('should return false if not liked', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      const isLiked = await likeRepositoryPostgres.isLiked('comment-123', 'user-123');
      expect(isLiked).toEqual(false);
    });
  });

  describe('getLikeCount function', () => {
    it('should return correct like count', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      await LikesTableTestHelper.addLike({ id: 'like-456', commentId: 'comment-123', owner: 'user-456' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const likeCount = await likeRepositoryPostgres.getLikeCount('comment-123');

      expect(likeCount).toEqual(2);
    });
  });
});
