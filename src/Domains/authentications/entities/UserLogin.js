class UserLogin {
  constructor({ username, password }) {
    this._verifyPayload({ username, password });
    this.username = username;
    this.password = password;
  }

  _verifyPayload({ username, password }) {
    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_SPECIFICATION');
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_SPECIFICATION');
    }

    if (username.length > 50) {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_SPECIFICATION');
    }

    if (username === 'xxxx') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = UserLogin;
