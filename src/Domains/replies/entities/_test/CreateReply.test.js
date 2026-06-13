const CreateReply = require('../CreateReply');

describe('CreateReply', () => {
  it('should error when payload does not contain needed property', () => {
    const payload = { content: 'sebuah balasan', owner: 'user-123' };
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should error when payload does not meet data specification', () => {
    const payload = { content: 123, commentId: 'comment-123', owner: 'user-123' };
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create CreateReply correctly', () => {
    const payload = { content: 'sebuah balasan', commentId: 'comment-123', owner: 'user-123' };
    const { content, commentId, owner } = new CreateReply(payload);
    expect(content).toEqual(payload.content);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
