import { distributePrice, groupBillsToSteps, calculateMemberReports } from '../settlement';
import type { BillWithMembers } from '../../types/bill';
import type { MemberWithDeposited } from '../../types/member';

describe('distributePrice', () => {
  it('균등하게 나눠떨어지는 경우 동일 금액을 분배한다', () => {
    expect(distributePrice(10000, 2)).toEqual([5000, 5000]);
    expect(distributePrice(9000, 3)).toEqual([3000, 3000, 3000]);
  });

  it('나머지가 발생하면 마지막 멤버에게 추가 할당한다', () => {
    expect(distributePrice(10000, 3)).toEqual([3333, 3333, 3334]);
    expect(distributePrice(10001, 4)).toEqual([2500, 2500, 2500, 2501]);
  });

  it('memberCount가 0 이하이면 빈 배열을 반환한다', () => {
    expect(distributePrice(10000, 0)).toEqual([]);
    expect(distributePrice(10000, -1)).toEqual([]);
  });

  it('memberCount가 1이면 전체 금액을 반환한다', () => {
    expect(distributePrice(10000, 1)).toEqual([10000]);
  });

  it('큰 금액도 정확히 분배한다', () => {
    const result = distributePrice(10000000, 7);
    expect(result).toHaveLength(7);
    expect(result.reduce((a, b) => a + b, 0)).toBe(10000000);
  });

  it('totalPrice가 0이면 모두 0을 반환한다', () => {
    expect(distributePrice(0, 3)).toEqual([0, 0, 0]);
  });
});

describe('groupBillsToSteps', () => {
  const memberA = { id: 1, name: 'Alice' };
  const memberB = { id: 2, name: 'Bob' };
  const memberC = { id: 3, name: 'Charlie' };

  function makeBill(id: number, members: typeof memberA[]): BillWithMembers {
    return { id, title: `Bill ${id}`, price: 10000, isFixed: false, members };
  }

  it('빈 배열이면 빈 배열을 반환한다', () => {
    expect(groupBillsToSteps([])).toEqual([]);
  });

  it('단일 bill은 하나의 step으로 묶인다', () => {
    const bills = [makeBill(1, [memberA, memberB])];
    const steps = groupBillsToSteps(bills);

    expect(steps).toHaveLength(1);
    expect(steps[0].bills).toHaveLength(1);
    expect(steps[0].members).toEqual([memberA, memberB]);
  });

  it('같은 멤버 구성의 연속된 bill은 같은 step으로 묶인다', () => {
    const bills = [
      makeBill(1, [memberA, memberB]),
      makeBill(2, [memberA, memberB]),
      makeBill(3, [memberA, memberB]),
    ];
    const steps = groupBillsToSteps(bills);

    expect(steps).toHaveLength(1);
    expect(steps[0].bills).toHaveLength(3);
  });

  it('다른 멤버 구성이면 별도 step으로 분리된다', () => {
    const bills = [
      makeBill(1, [memberA, memberB]),
      makeBill(2, [memberA, memberC]),
    ];
    const steps = groupBillsToSteps(bills);

    expect(steps).toHaveLength(2);
    expect(steps[0].bills).toHaveLength(1);
    expect(steps[1].bills).toHaveLength(1);
  });

  it('같은 멤버 → 다른 멤버 → 같은 멤버는 3개의 step이 된다', () => {
    const bills = [
      makeBill(1, [memberA, memberB]),
      makeBill(2, [memberA, memberC]),
      makeBill(3, [memberA, memberB]),
    ];
    const steps = groupBillsToSteps(bills);

    expect(steps).toHaveLength(3);
  });

  it('멤버 순서가 달라도 같은 멤버 구성이면 같은 step으로 묶인다', () => {
    const bills = [
      makeBill(1, [memberA, memberB]),
      makeBill(2, [memberB, memberA]),
    ];
    const steps = groupBillsToSteps(bills);

    expect(steps).toHaveLength(1);
    expect(steps[0].bills).toHaveLength(2);
  });
});

describe('calculateMemberReports', () => {
  const members: MemberWithDeposited[] = [
    { id: 1, name: 'Alice', isDeposited: false },
    { id: 2, name: 'Bob', isDeposited: true },
    { id: 3, name: 'Charlie', isDeposited: false },
  ];

  it('각 멤버의 정산 금액을 올바르게 합산한다', () => {
    const bills = [
      { details: [{ memberId: 1, price: 5000 }, { memberId: 2, price: 5000 }] },
      { details: [{ memberId: 1, price: 3000 }, { memberId: 3, price: 7000 }] },
    ];

    const reports = calculateMemberReports(members, bills);

    expect(reports).toEqual([
      { memberId: 1, memberName: 'Alice', isDeposited: false, price: 8000 },
      { memberId: 2, memberName: 'Bob', isDeposited: true, price: 5000 },
      { memberId: 3, memberName: 'Charlie', isDeposited: false, price: 7000 },
    ]);
  });

  it('bill이 없으면 모든 멤버의 금액이 0이다', () => {
    const reports = calculateMemberReports(members, []);

    expect(reports).toEqual([
      { memberId: 1, memberName: 'Alice', isDeposited: false, price: 0 },
      { memberId: 2, memberName: 'Bob', isDeposited: true, price: 0 },
      { memberId: 3, memberName: 'Charlie', isDeposited: false, price: 0 },
    ]);
  });

  it('멤버가 빈 배열이면 빈 배열을 반환한다', () => {
    const bills = [
      { details: [{ memberId: 1, price: 5000 }] },
    ];
    const reports = calculateMemberReports([], bills);
    expect(reports).toEqual([]);
  });

  it('isDeposited 상태를 올바르게 반영한다', () => {
    const membersWithDeposit: MemberWithDeposited[] = [
      { id: 1, name: 'Alice', isDeposited: true },
    ];
    const bills = [
      { details: [{ memberId: 1, price: 10000 }] },
    ];

    const reports = calculateMemberReports(membersWithDeposit, bills);
    expect(reports[0].isDeposited).toBe(true);
  });

  it('다수의 bill을 정확히 합산한다', () => {
    const singleMember: MemberWithDeposited[] = [
      { id: 1, name: 'Alice', isDeposited: false },
    ];
    const bills = [
      { details: [{ memberId: 1, price: 1000 }] },
      { details: [{ memberId: 1, price: 2000 }] },
      { details: [{ memberId: 1, price: 3000 }] },
    ];

    const reports = calculateMemberReports(singleMember, bills);
    expect(reports[0].price).toBe(6000);
  });
});
