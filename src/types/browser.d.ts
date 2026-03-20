// Screen Wake Lock API
// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
interface WakeLockSentinel {
  readonly released: boolean;
  release(): Promise<void>;
}

interface WakeLock {
  request(type: 'screen'): Promise<WakeLockSentinel>;
}

interface Navigator {
  readonly wakeLock: WakeLock;
}

// Runtime environment injected by Vercel or similar hosts
interface Window {
  MSStream?: unknown;
  _env_?: Record<string, string>;
}
