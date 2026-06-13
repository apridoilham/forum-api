const AddThreadUseCase = require('../AddThreadUseCase');
const CreatedThread = require('../../entities/CreatedThread');
const CreateThread = require('../../entities/CreateThread');

describe('AddThreadUseCase', () => {
  it('should orchestrate add thread action correctly', async () => {
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    const expectedCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = {
      addThread: jest.fn().mockResolvedValue(expectedCreatedThread),
    };

    const useCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });
    const createdThread = await useCase.execute(useCasePayload);

    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThread(useCasePayload));
  });
});
