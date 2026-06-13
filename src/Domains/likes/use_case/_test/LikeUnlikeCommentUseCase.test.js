const LikeUnlikeCommentUseCase = require('../LikeUnlikeCommentUseCase');

describe('LikeUnlikeCommentUseCase', () => {
  it('should orchestrate add like action correctly when not liked yet', async () => {
    const useCasePayload = { threadId: 'thread-123', commentId: 'comment-123', owner: 'user-123' };

    const mockThreadRepository = { verifyAvailableThread: jest.fn().mockResolvedValue() };
    const mockCommentRepository = { verifyAvailableComment: jest.fn().mockResolvedValue() };
    const mockLikeRepository = {
      isLiked: jest.fn().mockResolvedValue(false),
      addLike: jest.fn().mockResolvedValue(),
      removeLike: jest.fn().mockResolvedValue(),
    };

    const useCase = new LikeUnlikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isLiked).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.removeLike).not.toBeCalled();
  });

  it('should orchestrate remove like action correctly when already liked', async () => {
    const useCasePayload = { threadId: 'thread-123', commentId: 'comment-123', owner: 'user-123' };

    const mockThreadRepository = { verifyAvailableThread: jest.fn().mockResolvedValue() };
    const mockCommentRepository = { verifyAvailableComment: jest.fn().mockResolvedValue() };
    const mockLikeRepository = {
      isLiked: jest.fn().mockResolvedValue(true),
      addLike: jest.fn().mockResolvedValue(),
      removeLike: jest.fn().mockResolvedValue(),
    };

    const useCase = new LikeUnlikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isLiked).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.removeLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.addLike).not.toBeCalled();
  });
});
