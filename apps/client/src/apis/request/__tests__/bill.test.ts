import { requestPostBill, requestDeleteBill, requestPutBill, requestGetBillDetails, requestPutBillDetails } from '../bill';

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn();
});

function mockFetchOk(body?: unknown) {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => body,
  });
}

function lastFetchCall() {
  return (global.fetch as jest.Mock).mock.calls[0];
}

function lastFetchUrl(): string {
  return lastFetchCall()[0] as string;
}

describe('requestPostBill', () => {
  it('올바른 endpoint와 body로 POST 요청을 보낸다', async () => {
    mockFetchOk();

    await requestPostBill({
      eventId: 'abc123',
      title: '저녁 식사',
      price: 30000,
      memberIds: [1, 2, 3],
    });

    const [, init] = lastFetchCall();
    expect(lastFetchUrl()).toContain('/api/admin/events/abc123/bills');
    expect(init.method).toBe('POST');

    const body = JSON.parse(init.body);
    expect(body.title).toBe('저녁 식사');
    expect(body.price).toBe(30000);
    expect(body.billDetails).toHaveLength(3);

    const totalFromDetails = body.billDetails.reduce(
      (sum: number, d: { price: number }) => sum + d.price, 0,
    );
    expect(totalFromDetails).toBe(30000);
  });

  it('distributePrice를 사용하여 금액을 균등 분배한다', async () => {
    mockFetchOk();

    await requestPostBill({
      eventId: 'abc123',
      title: '커피',
      price: 10000,
      memberIds: [1, 2, 3],
    });

    const body = JSON.parse(lastFetchCall()[1].body);
    expect(body.billDetails[0].price).toBe(3333);
    expect(body.billDetails[1].price).toBe(3333);
    expect(body.billDetails[2].price).toBe(3334);
  });

  it('모든 billDetail의 isFixed가 false이다', async () => {
    mockFetchOk();

    await requestPostBill({
      eventId: 'abc123',
      title: '점심',
      price: 20000,
      memberIds: [1, 2],
    });

    const body = JSON.parse(lastFetchCall()[1].body);
    expect(body.billDetails.every((d: { isFixed: boolean }) => d.isFixed === false)).toBe(true);
  });

  it('각 billDetail에 올바른 memberId가 매핑된다', async () => {
    mockFetchOk();

    await requestPostBill({
      eventId: 'abc123',
      title: '간식',
      price: 10000,
      memberIds: [5, 10, 15],
    });

    const body = JSON.parse(lastFetchCall()[1].body);
    expect(body.billDetails.map((d: { memberId: number }) => d.memberId)).toEqual([5, 10, 15]);
  });
});

describe('requestDeleteBill', () => {
  it('올바른 endpoint로 DELETE 요청을 보낸다', async () => {
    mockFetchOk();

    await requestDeleteBill({ eventId: 'abc123', billId: 42 });

    const [, init] = lastFetchCall();
    expect(lastFetchUrl()).toContain('/api/admin/events/abc123/bills/42');
    expect(init.method).toBe('DELETE');
  });
});

describe('requestPutBill', () => {
  it('올바른 endpoint와 body로 PUT 요청을 보낸다', async () => {
    mockFetchOk();

    await requestPutBill({
      eventId: 'abc123',
      billId: 42,
      title: '수정된 제목',
      price: 50000,
    });

    const [, init] = lastFetchCall();
    expect(lastFetchUrl()).toContain('/api/admin/events/abc123/bills/42');
    expect(init.method).toBe('PUT');

    const body = JSON.parse(init.body);
    expect(body.title).toBe('수정된 제목');
    expect(body.price).toBe(50000);
  });
});

describe('requestGetBillDetails', () => {
  it('올바른 endpoint로 GET 요청을 보내고 응답을 반환한다', async () => {
    const mockResponse = {
      members: [
        { id: 1, memberId: 1, memberName: 'Alice', price: 5000, isFixed: false },
      ],
    };
    mockFetchOk(mockResponse);

    const result = await requestGetBillDetails({ eventId: 'abc123', billId: 42 });

    expect(lastFetchUrl()).toContain('/api/events/abc123/bills/42/details');
    expect(lastFetchCall()[1].method).toBe('GET');
    expect(result).toEqual(mockResponse);
  });
});

describe('requestPutBillDetails', () => {
  it('올바른 endpoint와 body로 PUT 요청을 보낸다', async () => {
    mockFetchOk();

    const billDetails = [
      { memberId: 1, price: 6000, isFixed: true },
      { memberId: 2, price: 4000, isFixed: false },
    ];

    await requestPutBillDetails({
      eventId: 'abc123',
      billId: 42,
      billDetails,
    });

    expect(lastFetchUrl()).toContain('/api/admin/events/abc123/bills/42/details');
    expect(lastFetchCall()[1].method).toBe('PUT');

    const body = JSON.parse(lastFetchCall()[1].body);
    expect(body.billDetails).toEqual(billDetails);
  });
});
