/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'secret_password',
    });

    return Jwt.token.generate({ username: 'dicoding', id: 'user-123' }, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
