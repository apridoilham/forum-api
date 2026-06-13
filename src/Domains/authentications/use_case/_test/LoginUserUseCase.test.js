const LoginUserUseCase = require('../LoginUserUseCase');
const NewAuth = require('../../entities/NewAuth');

describe('LoginUserUseCase', () => {
  it('should orchestrate login user action correctly', async () => {
    const useCasePayload = { username: 'dicoding', password: 'secret' };

    const expectedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const mockAuthenticationRepository = {
      addToken: jest.fn().mockResolvedValue(),
    };

    const mockAuthenticationTokenManager = {
      createAccessToken: jest.fn().mockResolvedValue(expectedAuthentication.accessToken),
      createRefreshToken: jest.fn().mockResolvedValue(expectedAuthentication.refreshToken),
    };

    const mockUserRepository = {
      getPasswordByUsername: jest.fn().mockResolvedValue('encrypted_password'),
      getIdByUsername: jest.fn().mockResolvedValue('user-123'),
    };

    const mockPasswordHash = {
      comparePassword: jest.fn().mockResolvedValue(),
    };

    const useCase = new LoginUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    const actualAuthentication = await useCase.execute(useCasePayload);

    expect(actualAuthentication).toStrictEqual(expectedAuthentication);
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.comparePassword).toBeCalledWith(useCasePayload.password, 'encrypted_password');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(expectedAuthentication.refreshToken);
  });
});
