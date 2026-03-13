import {useQuery} from '@tanstack/react-query';

import {requestGetKakaoLogin} from '@apis/request/auth';

import QUERY_KEYS from '@constants/queryKeys';

const useRequestGetKakaoLogin = () => {
  const code = new URLSearchParams(location.search).get('code');

  const {refetch, ...rest} = useQuery({
    queryKey: [QUERY_KEYS.kakaoLogin, code],
    queryFn: () => requestGetKakaoLogin(code ?? ''),
    enabled: false,
    retry: false, // 인가 코드는 1회용이므로 재시도하면 KOE320 발생
  });

  return {
    requestGetKakaoLogin: refetch,
    ...rest,
  };
};

export default useRequestGetKakaoLogin;
