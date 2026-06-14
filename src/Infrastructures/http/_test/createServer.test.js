const Boom = require('@hapi/boom');

const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../container');
const createServer = require('../createServer');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    const server = await createServer(container);

    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    const requestPayload = {
      username: 'dicoding',
      password: 'secret_password',
      fullname: 'Dicoding Indonesia',
    };
    const server = await createServer({
      getInstance: () => ({
        execute: () => {
          throw new Error('Terjadi sesuatu yang salah');
        },
      }),
    });

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should handle AuthenticationError correctly', async () => {
    const server = await createServer({
      getInstance: () => ({
        execute: () => {
          throw new AuthenticationError('authentication error!');
        },
      }),
    });

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(401);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('authentication error!');
  });

  it('should handle Joi validation error correctly', async () => {
    const server = await createServer({
      getInstance: () => ({
        execute: () => {
          const error = new Error('joi error');
          error.isJoi = true;
          throw error;
        },
      }),
    });

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('joi error');
  });

  it('should handle custom Boom error correctly', async () => {
    const server = await createServer({
      getInstance: () => ({
        execute: () => {
          throw Boom.badRequest('custom boom error');
        },
      }),
    });

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('custom boom error');
  });

  it('should handle custom Boom server error correctly', async () => {
    const server = await createServer({
      getInstance: () => ({
        execute: () => {
          throw Boom.internal('custom boom server error');
        },
      }),
    });

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });
});
