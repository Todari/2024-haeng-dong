import type {AllMembers, Reports} from 'types/serviceType';

import {WithErrorHandlingStrategy} from '@errors/RequestGetError';
import {calculateMemberReports} from '@haeng-dong/shared';

import {BASE_URL} from '@apis/baseUrl';
import {MEMBER_API_PREFIX} from '@apis/endpointPrefix';
import {requestGet} from '@apis/request';
import {WithEventId} from '@apis/withId.type';
import {requestGetBills} from './step';

export const requestGetReports = async ({eventId, ...props}: WithEventId<WithErrorHandlingStrategy>): Promise<Reports> => {
  const [bills, membersResponse] = await Promise.all([
    requestGetBills({eventId, ...props}),
    requestGet<AllMembers>({
      baseUrl: BASE_URL.HD,
      endpoint: `${MEMBER_API_PREFIX}/${eventId}/members`,
      ...props,
    }),
  ]);

  const reports = calculateMemberReports(membersResponse.members, bills);

  return {reports};
};
