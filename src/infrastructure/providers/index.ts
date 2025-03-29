import { OtpRepositoryProvider } from './otp.repository.provider';
import { SocialGraphRepositoryProvider } from './social-graph.repository.provider';
import { UsersRepositoryProvider } from './user.repository.provider';
import { VideoRepositoryProvider } from './video.repository.provider';

export const RepositoryProviders = [
  UsersRepositoryProvider,
  OtpRepositoryProvider,
  SocialGraphRepositoryProvider,
  VideoRepositoryProvider,
];
