const CreateComment = require('../CreateComment');

describe('CreateComment', () => {
  it('should error when payload does not contain needed property', () => {
    const payload = { content: 'sebuah comment', owner: 'user-123' };
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should error when payload does not meet data specification', () => {
    const payload = { content: 123, threadId: 'thread-123', owner: 'user-123' };
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create CreateComment correctly', () => {
    const payload = { content: 'sebuah comment', threadId: 'thread-123', owner: 'user-123' };
    const { content, threadId, owner } = new CreateComment(payload);
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
