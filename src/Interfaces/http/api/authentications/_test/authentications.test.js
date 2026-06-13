const pool = require('../../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../../../Infrastructures/http/container');
const createServer = require('../../../../Infrastructures/http/createServer');

describe('/authentications endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /authentications', () => {
    it('should response 201 and return authentication token', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret_password',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret_password',
          fullname: 'Dicoding Indonesia',
        },
      });

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should response 400 if login payload not contain needed property', async () => {
      const requestPayload = {
        username: 'dicoding',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan username dan password');
    });
  });

  describe('when PUT /authentications', () => {
    it('should response 200 and return new access token', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret_password',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret_password',
        },
      });

      const { data: { refreshToken } } = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should response 400 if put payload not contain refresh token', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan token refresh');
    });

    it('should response 400 if refresh token not valid', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'invalid_token',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 and delete refresh token', async () => {
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret_password',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret_password',
        },
      });

      const { data: { refreshToken } } = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 if delete payload not contain refresh token', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan token refresh');
    });
  });
});
