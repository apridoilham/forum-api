const CreatedThread = require('../CreatedThread');

describe('CreatedThread', () => {
  it('should error when payload does not contain needed property', () => {
    const payload = { id: 'thread-123', title: 'A Thread' };
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should error when payload does not meet data specification', () => {
    const payload = { id: 123, title: 'A Thread', owner: 'user-123' };
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create CreatedThread correctly', () => {
    const payload = { id: 'thread-123', title: 'A Thread', owner: 'user-123' };
    const { id, title, owner } = new CreatedThread(payload);
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
