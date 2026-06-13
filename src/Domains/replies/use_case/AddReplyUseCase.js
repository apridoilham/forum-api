const CreateReply = require('../entities/CreateReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const createReply = new CreateReply(useCasePayload);
    return this._replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;
