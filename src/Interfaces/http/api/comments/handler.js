const AddCommentUseCase = require('../../../../Domains/comments/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Domains/comments/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase);
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const addedComment = await addCommentUseCase.execute({ ...request.payload, threadId, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await deleteCommentUseCase.execute({ commentId, threadId, owner });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
