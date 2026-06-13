const { nanoid } = require('nanoid');
const UserRepository = require('../../Domains/users/UserRepository');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);
    return new RegisteredUser({ ...result.rows[0] });
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('username tidak ditemukan');
    }

    const { password } = result.rows[0];
    return password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('user tidak ditemukan');
    }

    const { id } = result.rows[0];
    return id;
  }
}

module.exports = UserRepositoryPostgres;
