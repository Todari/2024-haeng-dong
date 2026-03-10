import type { Bill, BillWithMembers, Step } from '../types/bill.js';
import type { Member, MemberWithDeposited } from '../types/member.js';
import type { Report } from '../types/report.js';

/**
 * 총액을 멤버 수로 균등 분배한다.
 * 나눠떨어지지 않는 나머지는 마지막 멤버에게 할당한다.
 *
 * @example
 * distributePrice(10000, 3) => [3333, 3333, 3334]
 */
export function distributePrice(totalPrice: number, memberCount: number): number[] {
  if (memberCount <= 0) return [];

  const eachPrice = Math.floor(totalPrice / memberCount);
  const remainder = totalPrice % memberCount;

  const results = Array.from({ length: memberCount - 1 }, () => eachPrice);
  results.push(eachPrice + remainder);
  return results;
}

/**
 * Bills를 동일한 멤버 구성 기준으로 Step 단위로 그룹핑한다.
 * 연속된 Bill이 같은 멤버 구성이면 같은 Step으로 묶인다.
 */
export function groupBillsToSteps(bills: BillWithMembers[]): Step[] {
  const steps: Step[] = [];

  for (const bill of bills) {
    const currentMemberIds = new Set(bill.members.map((m) => m.id));
    const lastStep = steps[steps.length - 1];

    const isSameMembers =
      lastStep &&
      lastStep.members.length === currentMemberIds.size &&
      lastStep.members.every((m) => currentMemberIds.has(m.id));

    if (isSameMembers) {
      lastStep.bills.push({
        id: bill.id,
        title: bill.title,
        price: bill.price,
        isFixed: bill.isFixed,
      });
    } else {
      steps.push({
        bills: [
          {
            id: bill.id,
            title: bill.title,
            price: bill.price,
            isFixed: bill.isFixed,
          },
        ],
        members: [...bill.members],
      });
    }
  }

  return steps;
}

interface BillDetailForReport {
  memberId: number;
  price: number;
}

interface BillForReport {
  details: BillDetailForReport[];
}

/**
 * 멤버 목록과 청구 목록으로부터 멤버별 정산 리포트를 계산한다.
 * 각 멤버가 총 얼마를 내야 하는지 합산한다.
 */
export function calculateMemberReports(
  members: MemberWithDeposited[],
  bills: BillForReport[],
): Report[] {
  const totals = new Map<number, number>();
  for (const member of members) {
    totals.set(member.id, 0);
  }

  for (const bill of bills) {
    for (const detail of bill.details) {
      const current = totals.get(detail.memberId) ?? 0;
      totals.set(detail.memberId, current + detail.price);
    }
  }

  return members.map((member) => ({
    memberId: member.id,
    memberName: member.name,
    isDeposited: member.isDeposited,
    price: totals.get(member.id) ?? 0,
  }));
}
