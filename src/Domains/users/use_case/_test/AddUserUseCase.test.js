const AddUserUseCase = require('../AddUserUseCase');
const RegisteredUser = require('../../entities/RegisteredUser');
const RegisterUser = require('../../entities/RegisterUser');

describe('AddUserUseCase', () => {
  it('should orchestrate add user action correctly', async () => {
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository = {
      verifyAvailableUsername: jest.fn().mockResolvedValue(),
      addUser: jest.fn().mockResolvedValue(expectedRegisteredUser),
    };

    const mockPasswordHash = {
      hash: jest.fn().mockResolvedValue('encrypted_password'),
    };

    const useCase = new AddUserUseCase({ userRepository: mockUserRepository, passwordHash: mockPasswordHash });
    const registeredUser = await useCase.execute(useCasePayload);

    expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    }));
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
  });
});
