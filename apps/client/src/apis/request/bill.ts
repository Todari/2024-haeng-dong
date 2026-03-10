import type {BillDetails} from 'types/serviceType';

import {WithErrorHandlingStrategy} from '@errors/RequestGetError';
import {distributePrice} from '@haeng-dong/shared';

import {BASE_URL} from '@apis/baseUrl';
import {ADMIN_API_PREFIX, MEMBER_API_PREFIX} from '@apis/endpointPrefix';
import {requestDelete, requestGet, requestPostWithoutResponse, requestPut} from '@apis/request';
import {WithBillId, WithEventId} from '@apis/withId.type';

export interface RequestPostBill {
  title: string;
  price: number;
  memberIds: number[];
}

export const requestPostBill = async ({eventId, title, price, memberIds}: WithEventId<RequestPostBill>) => {
  const prices = distributePrice(price, memberIds.length);
  const billDetails = memberIds.map((memberId, index) => ({
    memberId,
    price: prices[index],
    isFixed: false,
  }));

  await requestPostWithoutResponse({
    baseUrl: BASE_URL.HD,
    endpoint: `${ADMIN_API_PREFIX}/${eventId}/bills`,
    body: {
      title,
      price,
      billDetails,
    },
  });
};

export const requestDeleteBill = async ({eventId, billId}: WithEventId<WithBillId>) => {
  await requestDelete({
    baseUrl: BASE_URL.HD,
    endpoint: `${ADMIN_API_PREFIX}/${eventId}/bills/${billId}`,
  });
};

export interface RequestPutBill {
  title: string;
  price: number;
}

export const requestPutBill = async ({eventId, billId, title, price}: WithEventId<WithBillId<RequestPutBill>>) => {
  await requestPut({
    baseUrl: BASE_URL.HD,
    endpoint: `${ADMIN_API_PREFIX}/${eventId}/bills/${billId}`,
    body: {title, price},
  });
};

export const requestGetBillDetails = async ({
  eventId,
  billId,
  ...props
}: WithEventId<WithErrorHandlingStrategy<WithBillId>>) => {
  return requestGet<BillDetails>({
    baseUrl: BASE_URL.HD,
    endpoint: `${MEMBER_API_PREFIX}/${eventId}/bills/${billId}/details`,
    ...props,
  });
};

export interface PutBillDetail {
  memberId: number;
  price: number;
  isFixed: boolean;
}

export interface RequestPutBillDetails {
  billDetails: PutBillDetail[];
}

export const requestPutBillDetails = async ({
  eventId,
  billId,
  billDetails,
}: WithEventId<WithBillId<RequestPutBillDetails>>) => {
  await requestPut({
    baseUrl: BASE_URL.HD,
    endpoint: `${ADMIN_API_PREFIX}/${eventId}/bills/${billId}/details`,
    body: {billDetails},
  });
};
