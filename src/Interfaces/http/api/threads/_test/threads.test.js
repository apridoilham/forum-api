const pool = require('../../../../Infrastructures/database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../../tests/ServerTestHelper');
const container = require('../../../../Infrastructures/http/container');
const createServer = require('../../../../Infrastructures/http/createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        title: 'sebuah thread',
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 401 when no access token provided', async () => {
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      expect(response.statusCode).toEqual(401);
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread details', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual('thread-123');
      expect(responseJson.data.thread.title).toEqual('sebuah thread');
      expect(responseJson.data.thread.body).toEqual('sebuah body thread');
      expect(responseJson.data.thread.username).toEqual('dicoding');
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-notfound',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
