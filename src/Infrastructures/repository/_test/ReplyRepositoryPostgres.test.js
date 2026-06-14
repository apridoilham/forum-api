const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist create reply and return created reply correctly', async () => {
      const createReply = new CreateReply({
        content: 'sebuah balasan',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(createReply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return created reply correctly', async () => {
      const createReply = new CreateReply({
        content: 'sebuah balasan',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const createdReply = await replyRepositoryPostgres.addReply(createReply);

      expect(createdReply).toStrictEqual({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      });
    });
  });

  describe('verifyAvailableReply function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply available', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user is not the owner', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is the owner', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should soft delete reply correctly', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply('reply-123');

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_deleted).toEqual(true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies by comment id correctly', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'sebuah balasan',
        date: '2021-08-08T07:22:33.555Z',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'sebuah balasan dihapus',
        date: '2021-08-08T07:23:33.555Z',
        isDeleted: true,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      expect(replies).toHaveLength(2);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].username).toEqual('dicoding');
      expect(replies[0].content).toEqual('sebuah balasan');
      expect(replies[0].date).toBeDefined();

      expect(replies[1].id).toEqual('reply-456');
      expect(replies[1].username).toEqual('dicoding');
      expect(replies[1].content).toEqual('**balasan telah dihapus**');
      expect(replies[1].date).toBeDefined();
    });
  });
});
