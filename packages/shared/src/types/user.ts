import type { BankAccount, BankName } from './bank';
import type { Nickname } from './event';

export type User = BankAccount & {
  nickname: Nickname;
  isGuest: boolean;
  profileImage: string | null;
};

export type UserInfo = BankAccount & {
  nickname: string;
  isGuest: boolean;
  profileImage: string | null;
};
