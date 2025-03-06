import { SessionUser } from './api';

export type SessionPayload = {
  user: SessionUser;
  expiresAt: Date;
};
