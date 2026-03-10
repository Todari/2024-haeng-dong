import type { BankAccount, BankName } from './bank.js';
import type { Nickname } from './event.js';

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
