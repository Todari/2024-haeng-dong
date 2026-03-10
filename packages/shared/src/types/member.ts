export interface Member {
  id: number;
  name: string;
}

export interface MemberWithDeposited extends Member {
  isDeposited: boolean;
}
