const getKakaoRedirectUrl = () => {
  const redirectPath = process.env.KAKAO_REDIRECT_URI;
  if (!redirectPath) {
    throw new Error(
      'KAKAO_REDIRECT_URI 환경 변수가 설정되지 않았습니다. apps/client/.env.prod 또는 .env.dev에 KAKAO_REDIRECT_URI=/login/kakao 를 추가하세요.',
    );
  }
  return window.location.origin + redirectPath;
};

export default getKakaoRedirectUrl;
