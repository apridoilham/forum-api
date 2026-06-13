const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrate add comment action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const expectedCreatedComment = { id: 'comment-123', content: useCasePayload.content, owner: useCasePayload.owner };

    const mockCommentRepository = { addComment: jest.fn().mockResolvedValue(expectedCreatedComment) };
    const mockThreadRepository = { verifyAvailableThread: jest.fn().mockResolvedValue() };

    const useCase = new AddCommentUseCase({ commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });
    const createdComment = await useCase.execute(useCasePayload);

    expect(createdComment).toStrictEqual(expectedCreatedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalled();
  });
});
