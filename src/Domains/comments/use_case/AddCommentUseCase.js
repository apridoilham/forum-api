const CreateComment = require('../entities/CreateComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    const createComment = new CreateComment(useCasePayload);
    return this._commentRepository.addComment(createComment);
  }
}

module.exports = AddCommentUseCase;
