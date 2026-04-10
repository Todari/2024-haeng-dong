declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.GA_MEASUREMENT_ID;

if (GA_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // Must use `arguments` (IArguments), not rest params, to match the format
  // gtag.js expects when processing the dataLayer queue.
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

export const trackEvent = (eventName: string, eventParams: Record<string, unknown> = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};
