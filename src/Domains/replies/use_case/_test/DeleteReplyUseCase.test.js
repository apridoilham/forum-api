const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate delete reply action correctly', async () => {
    const useCasePayload = { replyId: 'reply-123', commentId: 'comment-123', threadId: 'thread-123', owner: 'user-123' };

    const mockReplyRepository = {
      verifyAvailableReply: jest.fn().mockResolvedValue(),
      verifyReplyOwner: jest.fn().mockResolvedValue(),
      deleteReply: jest.fn().mockResolvedValue(),
    };
    const mockCommentRepository = { verifyAvailableComment: jest.fn().mockResolvedValue() };
    const mockThreadRepository = { verifyAvailableThread: jest.fn().mockResolvedValue() };

    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
  });
});
