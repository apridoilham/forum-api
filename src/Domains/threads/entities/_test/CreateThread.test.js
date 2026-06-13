const CreateThread = require('../CreateThread');

describe('CreateThread', () => {
  it('should error when payload does not contain needed property', () => {
    const payload = { title: 'A Thread', owner: 'user-123' };
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should error when payload does not meet data specification', () => {
    const payload = { title: 123, body: 'A body', owner: 'user-123' };
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create CreateThread correctly', () => {
    const payload = { title: 'A Thread', body: 'A body', owner: 'user-123' };
    const { title, body, owner } = new CreateThread(payload);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
