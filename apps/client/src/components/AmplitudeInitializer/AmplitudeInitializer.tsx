// import {useEffect} from 'react';
// import {init} from '@amplitude/analytics-browser';

const AmplitudeInitializer = ({children}: React.PropsWithChildren) => {
  // Amplitude 트래킹 잠시 비활성화
  // useEffect(() => {
  //   init(process.env.AMPLITUDE_KEY, undefined, {
  //     defaultTracking: true,
  //   });
  // }, []);

  return children;
};

export default AmplitudeInitializer;
