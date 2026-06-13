const LikeUnlikeCommentUseCase = require('../../../../Domains/likes/use_case/LikeUnlikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const likeUnlikeCommentUseCase = this._container.getInstance(LikeUnlikeCommentUseCase);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await likeUnlikeCommentUseCase.execute({ threadId, commentId, owner });

    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;
