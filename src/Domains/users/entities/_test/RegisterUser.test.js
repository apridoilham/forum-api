const RegisterUser = require('../RegisterUser');

describe('RegisterUser', () => {
  it('should error when payload does not contain needed property', () => {
    const payload = { username: 'dicoding', password: 'secret' };
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should error when payload does not meet data specification', () => {
    const payload = { username: 123, password: 'secret', fullname: 'Dicoding Indonesia' };
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should error when username contains more than 50 characters', () => {
    const payload = { username: 'a'.repeat(51), password: 'secret', fullname: 'Dicoding Indonesia' };
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should error when username contains forbidden character', () => {
    const payload = { username: 'dico ding', password: 'secret', fullname: 'Dicoding Indonesia' };
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAIN_FORBIDDEN_CHAR');
  });

  it('should create RegisterUser object correctly', () => {
    const payload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
    const { username, password, fullname } = new RegisterUser(payload);
    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
    expect(fullname).toEqual(payload.fullname);
  });
});
