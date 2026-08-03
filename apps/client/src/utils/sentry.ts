import * as Sentry from '@sentry/react';

let initialized = false;

// Haengdong is a regular web app and never calls a WKWebView message handler.
// Some iOS in-app browsers inject a native bridge script that assumes this
// object exists; its uncaught exception is third-party noise, not an app error.
const injectedWebViewErrors = [/window\.webkit\.messageHandlers/u];

export function initSentry() {
  if (initialized) return;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0),
    initialScope: {tags: {service: 'haengdong'}},
    ignoreErrors: injectedWebViewErrors,
  });
  initialized = true;
}

export {Sentry};
