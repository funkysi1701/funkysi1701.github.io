/**
 * Shared list of benign console-error substrings that are known to appear
 * during normal site usage (ads, analytics, third-party widgets, network
 * conditions in CI) and should be excluded from console-error assertions.
 */
export const benignConsoleErrorSubstrings: ReadonlyArray<string> = [
  'ERR_NAME_NOT_RESOLVED',
  'ERR_ADDRESS_INVALID',
  'ERR_BLOCKED_BY_CLIENT',
  'ERR_CONNECTION_REFUSED',
  'ERR_CONNECTION_RESET',
  'ERR_TIMED_OUT',
  'ERR_FAILED',
  'ERR_ABORTED',
  'ResizeObserver loop',
  'ResizeObserver',
  'favicon.ico',
  'Failed to load resource',
  'net::ERR',
  'NS_BINDING_ABORTED',
  'Script error',
  'Permissions policy',
  'Tracking Prevention',
  'Third-party cookie',
  'googleads',
  'doubleclick',
  'googlesyndication',
  'googletagmanager',
  'giscus',
  'Disqus',
  'Content Security Policy',
  'Refused to execute',
  'Refused to load',
  'Cross-Origin',
];
