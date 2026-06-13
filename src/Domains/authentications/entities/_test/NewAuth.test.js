const NewAuth = require('../NewAuth');

describe('NewAuth', () => {
  it('should error when payload does not contain needed property', () => {
    const payload = { accessToken: 'access_token' };
    expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should error when payload does not meet data specification', () => {
    const payload = { accessToken: 'access_token', refreshToken: 123 };
    expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create NewAuth correctly', () => {
    const payload = { accessToken: 'access_token', refreshToken: 'refresh_token' };
    const { accessToken, refreshToken } = new NewAuth(payload);
    expect(accessToken).toEqual(payload.accessToken);
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
