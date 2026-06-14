const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist create thread and return created thread correctly', async () => {
      const createThread = new CreateThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(createThread);

      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      const createThread = new CreateThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const createdThread = await threadRepositoryPostgres.addThread(createThread);

      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread details correctly', async () => {
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: expect.any(String),
        username: 'dicoding',
      });
    });
  });
});
