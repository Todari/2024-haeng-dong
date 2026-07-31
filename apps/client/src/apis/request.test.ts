import SessionStorage from '@utils/SessionStorage';

import SESSION_STORAGE_KEYS from '@constants/sessionStorageKeys';

import {requestGet} from './request';

describe('request authentication', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    sessionStorage.clear();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ok: true}),
    });
  });

  it('비회원 로그인 토큰이 있으면 Bearer 인증 헤더를 보낸다', async () => {
    SessionStorage.set(SESSION_STORAGE_KEYS.accessToken, 'guest-token');

    await requestGet({
      baseUrl: 'https://api.example.com',
      endpoint: '/api/events/event-token',
      errorHandlingStrategy: 'ignore',
    });

    const [, requestInit] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    const headers = new Headers(requestInit.headers);

    expect(headers.get('Authorization')).toBe('Bearer guest-token');
  });
});
