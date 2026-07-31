import {render, screen} from '@testing-library/react';
import {useQuery} from '@tanstack/react-query';

import {RequestGetError} from '@errors/RequestGetError';

import {HDesignProvider} from '@HDesign/index';

import UnPredictableErrorBoundary from '../../UnPredictableErrorBoundary';

import QueryClientBoundary from './QueryClientBoundary';

const createRequestError = (errorHandlingStrategy: 'ignore' | 'errorBoundary') =>
  new RequestGetError({
    message: 'Unauthorized',
    name: 'UNAUTHORIZED',
    status: 401,
    endpoint: '/api/users/mine',
    method: 'GET',
    requestBody: null,
    errorCode: 'UNAUTHORIZED',
    errorHandlingStrategy,
  });

const QueryState = ({errorHandlingStrategy}: {errorHandlingStrategy: 'ignore' | 'errorBoundary'}) => {
  const {isError} = useQuery({
    queryKey: ['query-error-strategy', errorHandlingStrategy],
    queryFn: () => Promise.reject(createRequestError(errorHandlingStrategy)),
    retry: false,
  });

  return <div>{isError ? '조회 오류를 화면에서 처리함' : '조회 중'}</div>;
};

const setup = (errorHandlingStrategy: 'ignore' | 'errorBoundary') =>
  render(
    <HDesignProvider>
      <UnPredictableErrorBoundary>
        <QueryClientBoundary>
          <QueryState errorHandlingStrategy={errorHandlingStrategy} />
        </QueryClientBoundary>
      </UnPredictableErrorBoundary>
    </HDesignProvider>,
  );

describe('QueryClientBoundary', () => {
  it('ignore 전략의 조회 오류는 전역 오류 화면으로 전환하지 않는다.', async () => {
    setup('ignore');

    expect(await screen.findByText('조회 오류를 화면에서 처리함')).toBeInTheDocument();
    expect(screen.queryByText('알 수 없는 오류가 발생했습니다.')).not.toBeInTheDocument();
  });

  it('errorBoundary 전략의 조회 오류는 전역 오류 화면으로 전달한다.', async () => {
    setup('errorBoundary');

    expect(await screen.findByText('알 수 없는 오류가 발생했습니다.')).toBeInTheDocument();
  });
});
