import type { Member } from './member.js';

export interface Bill {
  id: number;
  title: string;
  price: number;
  isFixed: boolean;
}

export interface BillDetail {
  id: number;
  memberName: string;
  price: number;
  isFixed: boolean;
}

export interface BillWithDetails extends Bill {
  details: BillDetail[];
}

export interface BillWithMembers extends Bill {
  members: Member[];
}

export interface Step {
  bills: Bill[];
  members: Member[];
}
