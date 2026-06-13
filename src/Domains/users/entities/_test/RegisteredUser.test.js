const RegisteredUser = require('../RegisteredUser');

describe('RegisteredUser', () => {
  it('should error when payload does not contain needed property', () => {
    const payload = { id: 'user-123', username: 'dicoding' };
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should error when payload does not meet data specification', () => {
    const payload = { id: 123, username: 'dicoding', fullname: 'Dicoding Indonesia' };
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create RegisteredUser correctly', () => {
    const payload = { id: 'user-123', username: 'dicoding', fullname: 'Dicoding Indonesia' };
    const { id, username, fullname } = new RegisteredUser(payload);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
  });
});
