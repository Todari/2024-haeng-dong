import {Outlet} from 'react-router-dom';
import {Global} from '@emotion/react';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

import AmplitudeInitializer from '@components/AmplitudeInitializer/AmplitudeInitializer';
import ErrorCatcher from '@components/AppErrorBoundary/ErrorCatcher';
import QueryClientBoundary from '@components/QueryClientBoundary/QueryClientBoundary';
import ToastContainer from '@components/Toast/ToastContainer';

import {HDesignProvider} from '@HDesign/index';

import NetworkStateCatcher from '@utils/NetworkStateCatcher';

import {GlobalStyle} from './GlobalStyle';
import UnPredictableErrorBoundary from './UnPredictableErrorBoundary';
import {OverlayProvider} from '@components/Design/components/Overlay/OverlayProvider';

const App: React.FC = () => {
  return (
    <HDesignProvider>
      <UnPredictableErrorBoundary>
        <Global styles={GlobalStyle} />
        <ErrorCatcher>
          <QueryClientBoundary>
            <ReactQueryDevtools initialIsOpen={false} />
            <NetworkStateCatcher />
            <ToastContainer />
            <AmplitudeInitializer>
              <OverlayProvider>
                <Outlet />
              </OverlayProvider>
            </AmplitudeInitializer>
          </QueryClientBoundary>
        </ErrorCatcher>
      </UnPredictableErrorBoundary>
    </HDesignProvider>
  );
};

export default App;
