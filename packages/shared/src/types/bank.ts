export const BANK_NAMES = [
  '우리은행',
  'SC제일은행',
  '신한은행',
  'KB국민은행',
  '하나은행',
  '씨티은행',
  'IM뱅크',
  '부산은행',
  '경남은행',
  '광주은행',
  '전북은행',
  '제주은행',
  'IBK기업은행',
  'KDB산업은행',
  '수협은행',
  'NH농협',
  '새마을금고',
  '우체국은행',
  '신협은행',
  'SBI저축',
  '카카오뱅크',
  '토스뱅크',
  '케이뱅크',
] as const;

export type BankName = (typeof BANK_NAMES)[number] | '';

export interface BankAccount {
  bankName: BankName;
  accountNumber: string;
}
