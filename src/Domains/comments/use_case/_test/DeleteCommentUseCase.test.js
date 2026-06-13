const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate delete comment action correctly', async () => {
    const useCasePayload = { commentId: 'comment-123', threadId: 'thread-123', owner: 'user-123' };

    const mockCommentRepository = {
      verifyAvailableComment: jest.fn().mockResolvedValue(),
      verifyCommentOwner: jest.fn().mockResolvedValue(),
      deleteComment: jest.fn().mockResolvedValue(),
    };

    const useCase = new DeleteCommentUseCase({ commentRepository: mockCommentRepository });
    await useCase.execute(useCasePayload);

    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
  });
});
