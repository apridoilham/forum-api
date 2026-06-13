const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error when payload does not contain refresh token', async () => {
    const useCase = new RefreshAuthenticationUseCase({
      authenticationRepository: {},
      authenticationTokenManager: {},
    });
    await expect(useCase.execute({})).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error when payload has wrong data type', async () => {
    const useCase = new RefreshAuthenticationUseCase({
      authenticationRepository: {},
      authenticationTokenManager: {},
    });
    await expect(useCase.execute({ refreshToken: 1 })).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION');
  });

  it('should orchestrate refresh authentication correctly', async () => {
    const useCasePayload = { refreshToken: 'some_refresh_token' };
    const mockAuthRepository = { checkAvailabilityToken: jest.fn().mockResolvedValue() };
    const mockTokenManager = {
      verifyRefreshToken: jest.fn().mockResolvedValue(),
      decodePayload: jest.fn().mockResolvedValue({ username: 'dicoding', id: 'user-123' }),
      createAccessToken: jest.fn().mockResolvedValue('new_access_token'),
    };
    const useCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthRepository,
      authenticationTokenManager: mockTokenManager,
    });
    const accessToken = await useCase.execute(useCasePayload);
    expect(mockTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthRepository.checkAvailabilityToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.decodePayload).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.createAccessToken).toBeCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(accessToken).toEqual('new_access_token');
  });
});
