const UserLogin = require('../UserLogin');

describe('UserLogin', () => {
  it('should error when payload does not contain needed property', () => {
    const payload = { username: 'dicoding' };
    expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should error when payload does not meet data specification', () => {
    const payload = { username: 123, password: 'secret' };
    expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create UserLogin correctly', () => {
    const payload = { username: 'dicoding', password: 'secret' };
    const { username, password } = new UserLogin(payload);
    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});
