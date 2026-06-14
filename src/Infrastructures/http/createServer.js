const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');

const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const replies = require('../../Interfaces/http/api/replies');
const likes = require('../../Interfaces/http/api/likes');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const swaggerOptions = {
    info: {
      title: 'Forum API Documentation',
      version: '1.0.0',
    },
  };

  await server.register([
    Jwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
    {
      plugin: likes,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof NotFoundError) {
        return h.response({
          status: 'fail',
          message: translatedError.message,
        }).code(404);
      }

      if (translatedError instanceof AuthorizationError) {
        return h.response({
          status: 'fail',
          message: translatedError.message,
        }).code(403);
      }

      if (translatedError instanceof AuthenticationError) {
        return h.response({
          status: 'fail',
          message: translatedError.message,
        }).code(401);
      }

      if (translatedError instanceof InvariantError) {
        return h.response({
          status: 'fail',
          message: translatedError.message,
        }).code(400);
      }

      if (translatedError.isJoi) {
        return h.response({
          status: 'fail',
          message: translatedError.message,
        }).code(400);
      }

      if (translatedError.isBoom && !translatedError.isServer) {
        return h.response({
          status: 'fail',
          message: translatedError.message,
        }).code(translatedError.output.statusCode);
      }

      const response2 = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      response2.code(500);
      console.error(translatedError);
      return response2;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
