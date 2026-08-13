import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns `false` during server rendering and the first client render,
 * then `true` once React has hydrated on the client. Safe to use for
 * gating browser-only APIs (e.g. `document`, portals) without the
 * "setState synchronously within an effect" cascading-render warning
 * that `useEffect(() => setState(true), [])` triggers.
 */
export const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
