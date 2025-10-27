import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://a9d2a63fa006126d2bff8f8148ad8cab@o4510250520936448.ingest.de.sentry.io/4510250534568016",
    // Replay may only be enabled for the client-side
    integrations: [Sentry.replayIntegration()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // ...

    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
});