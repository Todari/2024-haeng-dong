import {ErrorBoundary, FallbackProps} from 'react-error-boundary';

import {StrictPropsWithChildren} from '@type/strictPropsWithChildren';
import ErrorPage from '@pages/fallback/ErrorPage';

const UnPredictableErrorFallback = ({error}: FallbackProps) => {
  return <ErrorPage error={error} />;
};

const UnPredictableErrorBoundary = ({children}: StrictPropsWithChildren) => {
  return <ErrorBoundary FallbackComponent={UnPredictableErrorFallback}>{children}</ErrorBoundary>;
};

export default UnPredictableErrorBoundary;
