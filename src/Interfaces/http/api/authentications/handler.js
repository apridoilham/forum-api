const LoginUserUseCase = require('../../../../Domains/authentications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../Domains/authentications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../../../../Domains/authentications/use_case/LogoutUserUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    const refreshAuthenticationUseCase = this._container.getInstance(RefreshAuthenticationUseCase);
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request, h) {
    const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase);
    await logoutUserUseCase.execute(request.payload);

    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
