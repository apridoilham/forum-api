const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate get thread detail correctly', async () => {
    const threadId = 'thread-123';
    const expectedThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };
    const expectedComments = [
      {
        id: 'comment-111',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-111',
        username: 'dicoding',
        date: '2021-08-08T07:25:00.000Z',
        content: 'sebuah balasan',
      },
    ];

    const mockThreadRepository = {
      verifyAvailableThread: jest.fn().mockResolvedValue(),
      getThreadById: jest.fn().mockResolvedValue(expectedThread),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: jest.fn().mockResolvedValue(expectedComments),
    };
    const mockReplyRepository = {
      getRepliesByCommentId: jest.fn().mockResolvedValue(expectedReplies),
    };
    const mockLikeRepository = {
      getLikeCount: jest.fn().mockResolvedValue(2),
    };

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await useCase.execute(threadId);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(thread.id).toEqual(threadId);
    expect(thread.comments[0].likeCount).toEqual(2);
    expect(thread.comments[0].replies).toEqual(expectedReplies);
  });
});
