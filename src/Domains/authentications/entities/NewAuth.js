class NewAuth {
  constructor({ accessToken, refreshToken }) {
    this._verifyPayload({ accessToken, refreshToken });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  _verifyPayload({ accessToken, refreshToken }) {
    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = NewAuth;
