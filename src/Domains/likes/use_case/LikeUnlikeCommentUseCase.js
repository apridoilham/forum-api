class LikeUnlikeCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);

    const isLiked = await this._likeRepository.isLiked(commentId, owner);
    if (isLiked) {
      await this._likeRepository.removeLike(commentId, owner);
    } else {
      await this._likeRepository.addLike(commentId, owner);
    }
  }
}

module.exports = LikeUnlikeCommentUseCase;
