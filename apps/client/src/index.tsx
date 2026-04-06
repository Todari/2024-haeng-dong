import './ga';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
// import * as Sentry from '@sentry/react';

import router from './router';

// Sentry 비활성화 (필요 시 주석 해제)
// Sentry.init({
//   dsn: 'https://81685591a3234c689be8c48959b04c88@o4507739935997952.ingest.us.sentry.io/4507739943272448',
//   integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
//   tracesSampleRate: 1.0,
//   tracePropagationTargets: ['localhost'],
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
// });

// MSW 모킹을 사용하려면 아래 주석을 해제하고 save해주세요.
// async function enableMocking() {
//   const {worker} = await import('./mocks/browser');
//   return worker.start();
// }

// enableMocking().then(() => {
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
// });
