const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
  it('should throw error when payload does not contain refresh token', async () => {
    const useCase = new LogoutUserUseCase({ authenticationRepository: {} });
    await expect(useCase.execute({})).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error when refresh token is not string', async () => {
    const useCase = new LogoutUserUseCase({ authenticationRepository: {} });
    await expect(useCase.execute({ refreshToken: 123 })).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION');
  });

  it('should orchestrate delete authentication correctly', async () => {
    const mockAuthRepository = {
      checkAvailabilityToken: jest.fn().mockResolvedValue(),
      deleteToken: jest.fn().mockResolvedValue(),
    };
    const useCase = new LogoutUserUseCase({ authenticationRepository: mockAuthRepository });
    await useCase.execute({ refreshToken: 'refresh_token' });
    expect(mockAuthRepository.checkAvailabilityToken).toBeCalledWith('refresh_token');
    expect(mockAuthRepository.deleteToken).toBeCalledWith('refresh_token');
  });
});
