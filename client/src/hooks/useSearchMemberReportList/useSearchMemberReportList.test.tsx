import {renderHook, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import reportListJson from '../../mocks/reportList.json';
import {ErrorProvider} from '../useError/ErrorProvider';

import useSearchMemberReportList from './useSearchMemberReportList';

describe('useSearchMemberReportList', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
  });

  const initializeProvider = (name: string) =>
    renderHook(() => useSearchMemberReportList({name}), {
      wrapper: ({children}) => (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ErrorProvider>{children}</ErrorProvider>
          </MemoryRouter>
        </QueryClientProvider>
      ),
    });

  it('빈 값을 검색한다면 검색 목록은 비어있다.', async () => {
    const {result} = initializeProvider('');

    await waitFor(() => expect(result.current.memberReportSearchList).toStrictEqual(reportListJson));
  });

  it('검색어의 일부와 일치하는 이름이 있다면 해당 이름을 목록에 반환한다.', async () => {
    const keyword = '소';
    const {result} = initializeProvider(keyword);
    const expectedMemberReportSearchList = reportListJson.filter(memberReport => memberReport.name.includes(keyword));

    await waitFor(() => {
      expect(result.current.memberReportSearchList).toStrictEqual(expectedMemberReportSearchList);
    });
  });
});
