import './ga';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import {initSentry} from '@utils/sentry';

import router from './router';

initSentry();

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
