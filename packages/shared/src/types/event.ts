import type { BankAccount } from './bank.js';

export type EventId = string;
export type EventName = string;
export type Nickname = string;
export type Password = string;

export interface EventCreationData {
  eventName: EventName;
  nickname: Nickname;
  password: Password;
}

export type Event = BankAccount & {
  eventName: EventName;
  createdByGuest: boolean;
};

export interface CreatedEvent {
  eventId: string;
  eventName: string;
  isFinished: boolean;
  createdAt: string;
}

export interface ImageFile {
  id: number;
  url: string;
}
