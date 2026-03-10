import {Step} from 'types/serviceType';
import {WithErrorHandlingStrategy} from '@errors/RequestGetError';
import {groupBillsToSteps} from '@haeng-dong/shared';

import {BASE_URL} from '@apis/baseUrl';
import {MEMBER_API_PREFIX} from '@apis/endpointPrefix';
import {requestGet} from '@apis/request';
import {WithEventId} from '@apis/withId.type';

interface BillFromServer {
  id: number;
  title: string;
  price: number;
  isFixed: boolean;
  members: {id: number; name: string}[];
  details: {memberId: number; price: number}[];
}

export const requestGetBills = async ({eventId, ...props}: WithEventId<WithErrorHandlingStrategy>) => {
  return await requestGet<BillFromServer[]>({
    baseUrl: BASE_URL.HD,
    endpoint: `${MEMBER_API_PREFIX}/${eventId}/bills`,
    ...props,
  });
};

export const requestGetSteps = async ({eventId, ...props}: WithEventId<WithErrorHandlingStrategy>): Promise<Step[]> => {
  const bills = await requestGetBills({eventId, ...props});

  return groupBillsToSteps(bills);
};
