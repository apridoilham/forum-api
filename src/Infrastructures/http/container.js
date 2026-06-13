/* istanbul ignore file */
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('../database/postgres/pool');

// Repositories
const UserRepositoryPostgres = require('../repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('../repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('../repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../repository/ReplyRepositoryPostgres');
const LikeRepositoryPostgres = require('../repository/LikeRepositoryPostgres');

// Security
const BcryptPasswordHash = require('../securities/BcryptPasswordHash');
const JwtTokenManager = require('../securities/JwtTokenManager');

// Use Cases
const AddUserUseCase = require('../../Domains/users/use_case/AddUserUseCase');
const LoginUserUseCase = require('../../Domains/authentications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../Domains/authentications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../../Domains/authentications/use_case/RefreshAuthenticationUseCase');
const AddThreadUseCase = require('../../Domains/threads/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../Domains/threads/use_case/GetThreadDetailUseCase');
const AddCommentUseCase = require('../../Domains/comments/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../Domains/comments/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../../Domains/replies/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../Domains/replies/use_case/DeleteReplyUseCase');
const LikeUnlikeCommentUseCase = require('../../Domains/likes/use_case/LikeUnlikeCommentUseCase');

// Instance repositories
const userRepository = new UserRepositoryPostgres(pool, nanoid);
const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
const likeRepository = new LikeRepositoryPostgres(pool, nanoid);

// Instance security
const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
const jwtTokenManager = new JwtTokenManager(Jwt);

const container = {
  getInstance(Class) {
    switch (Class) {
      case AddUserUseCase:
        return new AddUserUseCase({ userRepository, passwordHash: bcryptPasswordHash });
      case LoginUserUseCase:
        return new LoginUserUseCase({
          authenticationRepository,
          authenticationTokenManager: jwtTokenManager,
          userRepository,
          passwordHash: bcryptPasswordHash,
        });
      case LogoutUserUseCase:
        return new LogoutUserUseCase({ authenticationRepository });
      case RefreshAuthenticationUseCase:
        return new RefreshAuthenticationUseCase({
          authenticationRepository,
          authenticationTokenManager: jwtTokenManager,
        });
      case AddThreadUseCase:
        return new AddThreadUseCase({ threadRepository });
      case GetThreadDetailUseCase:
        return new GetThreadDetailUseCase({
          threadRepository,
          commentRepository,
          replyRepository,
          likeRepository,
        });
      case AddCommentUseCase:
        return new AddCommentUseCase({ commentRepository, threadRepository });
      case DeleteCommentUseCase:
        return new DeleteCommentUseCase({ commentRepository });
      case AddReplyUseCase:
        return new AddReplyUseCase({ replyRepository, commentRepository, threadRepository });
      case DeleteReplyUseCase:
        return new DeleteReplyUseCase({ replyRepository, commentRepository, threadRepository });
      case LikeUnlikeCommentUseCase:
        return new LikeUnlikeCommentUseCase({ likeRepository, commentRepository, threadRepository });
      default:
        throw new Error(`Unknown class: ${Class.name}`);
    }
  },
};

module.exports = container;
