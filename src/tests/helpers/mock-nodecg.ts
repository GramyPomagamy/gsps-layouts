/* eslint-disable no-unused-vars */
import { vi, type Mock } from "vitest";

export interface MockReplicantOptions<T> {
  defaultValue?: T;
  persistent?: boolean;
}

export interface MockReplicant<T> {
  value: T | undefined;
  on: Mock;
  once: Mock;
  off: Mock;
  removeListener: Mock;
  removeAllListeners: Mock;
  opts: MockReplicantOptions<T>;
  namespace: string;
  name: string;
  /** Simulate a change event */
  emit: (event: string, newValue: T, oldValue?: T) => void;
}

export type MessageHandler = (...args: unknown[]) => void | Promise<void>;

export interface MockNodeCG {
  Replicant: <T>(
    name: string,
    namespaceOrOpts?: string | MockReplicantOptions<T>,
    opts?: MockReplicantOptions<T>
  ) => MockReplicant<T>;
  listenFor: Mock;
  sendMessage: Mock;
  sendMessageToBundle: Mock;
  Router: Mock;
  mount: Mock;
  log: {
    info: Mock;
    warn: Mock;
    error: Mock;
    debug: Mock;
    trace: Mock;
  };
  bundleConfig: Record<string, unknown>;
  bundleName: string;

  // Test helpers
  /** Get a replicant that was created */
  getReplicant: <T>(name: string, namespace?: string) => MockReplicant<T> | undefined;
  /** Get all created replicants */
  getAllReplicants: () => Map<string, MockReplicant<unknown>>;
  /** Trigger a message listener */
  triggerMessage: (messageName: string, ...args: unknown[]) => Promise<void>;
  /** Get all registered message listeners */
  getMessageListeners: () => Map<string, MessageHandler[]>;
  /** Reset all mocks and state */
  reset: () => void;
}

export function createMockNodeCG(
  bundleConfig: Record<string, unknown> = {},
  bundleName = "gsps-layouts"
): MockNodeCG {
  const replicants = new Map<string, MockReplicant<unknown>>();
  const messageListeners = new Map<string, MessageHandler[]>();

  const getReplicantKey = (name: string, namespace?: string) =>
    namespace ? `${namespace}:${name}` : name;

  const createReplicant = <T>(
    name: string,
    namespaceOrOpts?: string | MockReplicantOptions<T>,
    opts?: MockReplicantOptions<T>
  ): MockReplicant<T> => {
    let namespace = bundleName;
    let options: MockReplicantOptions<T> = {};

    if (typeof namespaceOrOpts === "string") {
      namespace = namespaceOrOpts;
      options = opts ?? {};
    } else if (namespaceOrOpts) {
      options = namespaceOrOpts;
    }

    const key = getReplicantKey(name, namespace);

    // Return existing replicant if already created
    if (replicants.has(key)) {
      return replicants.get(key) as MockReplicant<T>;
    }

    const eventHandlers: Map<string, Set<(...args: unknown[]) => void>> =
      new Map();

    const replicant: MockReplicant<T> = {
      value: options.defaultValue,
      opts: options,
      namespace,
      name,
      on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
        if (!eventHandlers.has(event)) {
          eventHandlers.set(event, new Set());
        }
        eventHandlers.get(event)!.add(handler);
        return replicant;
      }),
      once: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
        const wrappedHandler = (...args: unknown[]) => {
          handler(...args);
          eventHandlers.get(event)?.delete(wrappedHandler);
        };
        if (!eventHandlers.has(event)) {
          eventHandlers.set(event, new Set());
        }
        eventHandlers.get(event)!.add(wrappedHandler);
        return replicant;
      }),
      off: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
        eventHandlers.get(event)?.delete(handler);
        return replicant;
      }),
      removeListener: vi.fn(
        (event: string, handler: (...args: unknown[]) => void) => {
          eventHandlers.get(event)?.delete(handler);
          return replicant;
        }
      ),
      removeAllListeners: vi.fn((event?: string) => {
        if (event) {
          eventHandlers.delete(event);
        } else {
          eventHandlers.clear();
        }
        return replicant;
      }),
      emit: (event: string, newValue: T, oldValue?: T) => {
        const handlers = eventHandlers.get(event);
        if (handlers) {
          for (const handler of handlers) {
            handler(newValue, oldValue);
          }
        }
      },
    };

    replicants.set(key, replicant as MockReplicant<unknown>);
    return replicant;
  };

  const listenFor = vi.fn(
    (
      messageName: string,
      bundleNameOrHandler?: string | MessageHandler,
      handler?: MessageHandler
    ) => {
      let actualHandler: MessageHandler;
      let actualBundleName: string = bundleName;

      if (typeof bundleNameOrHandler === "function") {
        actualHandler = bundleNameOrHandler;
      } else if (typeof bundleNameOrHandler === "string" && handler) {
        actualBundleName = bundleNameOrHandler;
        actualHandler = handler;
      } else {
        throw new Error("Invalid listenFor arguments");
      }

      const key = `${actualBundleName}:${messageName}`;
      if (!messageListeners.has(key)) {
        messageListeners.set(key, []);
      }
      messageListeners.get(key)!.push(actualHandler);
    }
  );

  const sendMessage = vi.fn();
  const sendMessageToBundle = vi.fn();

  const mockRouter = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    use: vi.fn(),
    patch: vi.fn(),
  };

  const Router = vi.fn(() => mockRouter);

  const mount = vi.fn();

  const log = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
  };

  const triggerMessage = async (
    messageName: string,
    ...args: unknown[]
  ): Promise<void> => {
    // Check both with and without bundle prefix
    const keys = [
      `${bundleName}:${messageName}`,
      messageName,
    ];

    for (const key of keys) {
      const handlers = messageListeners.get(key);
      if (handlers) {
        for (const handler of handlers) {
          await handler(...args);
        }
      }
    }
  };

  const reset = () => {
    replicants.clear();
    messageListeners.clear();
    listenFor.mockClear();
    sendMessage.mockClear();
    sendMessageToBundle.mockClear();
    Router.mockClear();
    mount.mockClear();
    log.info.mockClear();
    log.warn.mockClear();
    log.error.mockClear();
    log.debug.mockClear();
    log.trace.mockClear();
  };

  return {
    Replicant: createReplicant,
    listenFor,
    sendMessage,
    sendMessageToBundle,
    Router,
    mount,
    log,
    bundleConfig,
    bundleName,
    getReplicant: <T>(name: string, namespace?: string) =>
      replicants.get(getReplicantKey(name, namespace)) as
        | MockReplicant<T>
        | undefined,
    getAllReplicants: () => replicants,
    triggerMessage,
    getMessageListeners: () => messageListeners,
    reset,
  };
}

/**
 * Creates a mock logger matching TaggedLogger interface
 */
export function createMockLogger() {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
  };
}

/**
 * Helper to create module params for testing
 */
export function createMockModuleParams<TConfig>(
  config: TConfig,
  nodecgOverrides?: Partial<MockNodeCG>,
  bundleConfig?: Record<string, unknown>
) {
  const nodecg = { ...createMockNodeCG(bundleConfig), ...nodecgOverrides };
  const logger = createMockLogger();

  return {
    nodecg,
    config,
    logger,
  };
}

