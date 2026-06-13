const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrate add reply action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah balasan',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const expectedCreatedReply = { id: 'reply-123', content: useCasePayload.content, owner: useCasePayload.owner };

    const mockReplyRepository = { addReply: jest.fn().mockResolvedValue(expectedCreatedReply) };
    const mockCommentRepository = { verifyAvailableComment: jest.fn().mockResolvedValue() };
    const mockThreadRepository = { verifyAvailableThread: jest.fn().mockResolvedValue() };

    const useCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const createdReply = await useCase.execute(useCasePayload);

    expect(createdReply).toStrictEqual(expectedCreatedReply);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalled();
  });
});
