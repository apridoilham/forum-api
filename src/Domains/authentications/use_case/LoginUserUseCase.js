const UserLogin = require('../entities/UserLogin');
const NewAuth = require('../entities/NewAuth');

class LoginUserUseCase {
  constructor({
    authenticationRepository,
    authenticationTokenManager,
    userRepository,
    passwordHash,
  }) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);
    await this._passwordHash.comparePassword(password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._authenticationTokenManager.createAccessToken({ username, id });
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({ username, id });

    const newAuthentication = new NewAuth({
      accessToken,
      refreshToken,
    });

    await this._authenticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}

module.exports = LoginUserUseCase;
