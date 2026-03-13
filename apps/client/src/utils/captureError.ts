// import RequestError from '@errors/RequestError';

// import sendLogToSentry from './sendLogToSentry';

export const captureError = async (_error: Error) => {
  // Sentry 비활성화로 에러 로깅 스킵 (필요 시 아래 주석 해제)
  return;

  /*
  if (process.env.NODE_ENV !== 'production') return;

  if (error instanceof RequestError) {
    switch (error.errorCode) {
      case 'INTERNAL_SERVER_ERROR':
        sendLogToSentry({error, level: 'fatal'});
        break;
      case 'FORBIDDEN':
      case 'TOKEN_INVALID':
      case 'TOKEN_EXPIRED':
      case 'TOKEN_NOT_FOUND':
        sendLogToSentry({error});
        break;
      case 'PASSWORD_INVALID':
      case 'BILL_ACTION_PRICE_INVALID':
        sendLogToSentry({error, level: 'debug'});
        break;
      default:
        sendLogToSentry({error, level: 'fatal'});
        break;
    }
  } else {
    sendLogToSentry({error, level: 'fatal'});
  }
  */
};
