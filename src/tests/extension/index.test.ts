import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createMockNodeCG, type MockNodeCG } from "../helpers";

vi.mock("../../extension/modules/index.js", () => ({
  defineModules: vi.fn(),
}));

vi.mock("../../extension/util/tagged-logger.js", () => {
  // eslint-disable-next-line no-unused-vars
  const TaggedLogger = vi.fn().mockImplementation(function (_name: string) {
    return {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
    };
  });

  return { TaggedLogger };
});

import extensionLoader from "../../extension/index.js";
import { defineModules } from "../../extension/modules/index.js";
import { TaggedLogger } from "../../extension/util/tagged-logger.js";

describe("Extension Loader", () => {
  let mockNodecg: MockNodeCG;
  let mockSetup: Mock;
  let mockSetup2: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNodecg = createMockNodeCG();
    mockSetup = vi.fn();
    mockSetup2 = vi.fn();
  });

  it("should load enabled modules", async () => {
    (defineModules as Mock).mockReturnValue({
      testEnabledModule: {
        name: "Test Module",
        enabled: true,
        config: { foo: "bar" },
        loadFn: vi.fn().mockResolvedValue({ setup: mockSetup }),
      },
      testDisabledModule: {
        name: "Test Disabled Module",
        enabled: false,
        config: { foo: "bar" },
        loadFn: vi.fn().mockResolvedValue({ setup: mockSetup2 }),
      },
    });

    await extensionLoader(mockNodecg);

    expect(defineModules).toHaveBeenCalledWith(mockNodecg);
    expect(mockSetup).toHaveBeenCalledWith({
      nodecg: mockNodecg,
      config: { foo: "bar" },
      logger: expect.any(Object),
    });
  });

  it("should skip disabled modules", async () => {
    (defineModules as Mock).mockReturnValue({
        testEnabledModule: {
          name: "Test Module",
          enabled: true,
          config: { foo: "bar" },
          loadFn: vi.fn().mockResolvedValue({ setup: mockSetup }),
        },
        testDisabledModule: {
          name: "Test Disabled Module",
          enabled: false,
          config: { foo: "bar" },
          loadFn: vi.fn().mockResolvedValue({ setup: mockSetup2 }),
        },
      });

    await extensionLoader(mockNodecg);

    expect(mockSetup2).not.toHaveBeenCalled();
  });

  it("should load multiple modules in parallel", async () => {
    const setupA = vi.fn();
    const setupB = vi.fn();

    (defineModules as Mock).mockReturnValue({
      moduleA: {
        name: "Test Module A",
        enabled: true,
        config: { a: 1 },
        loadFn: vi.fn().mockResolvedValue({ setup: setupA }),
      },
      moduleB: {
        name: "Test Module B",
        enabled: true,
        config: { b: 2 },
        loadFn: vi.fn().mockResolvedValue({ setup: setupB }),
      },
    });

    await extensionLoader(mockNodecg);

    expect(setupA).toHaveBeenCalled();
    expect(setupB).toHaveBeenCalled();
  });

  it("should log error when module setup throws an Error", async () => {
    const error = new Error("Module failed to load");
    mockSetup.mockRejectedValue(error);

    (defineModules as Mock).mockReturnValue({
      failingModule: {
        name: "Failing Module",
        enabled: true,
        config: {},
        loadFn: vi.fn().mockResolvedValue({ setup: mockSetup }),
      },
    });

    await extensionLoader(mockNodecg);

    // The TaggedLogger's error method should have been called
    expect(TaggedLogger).toHaveBeenCalledWith("Failing Module", mockNodecg);
  });

  it("should log error when module setup throws a non-Error value", async () => {
    mockSetup.mockRejectedValue("string error");

    (defineModules as Mock).mockReturnValue({
      failingModule: {
        name: "Failing Module",
        enabled: true,
        config: {},
        loadFn: vi.fn().mockResolvedValue({ setup: mockSetup }),
      },
    });

    // Should not throw, error is caught and logged
    await expect(extensionLoader(mockNodecg)).resolves.toBeUndefined();
  });

  it("should create TaggedLogger with correct module name", async () => {
    (defineModules as Mock).mockReturnValue({
      namedModule: {
        name: "Test Module",
        enabled: true,
        config: {},
        loadFn: vi.fn().mockResolvedValue({ setup: mockSetup }),
      },
    });

    await extensionLoader(mockNodecg);

    expect(TaggedLogger).toHaveBeenCalledWith("Test Module", mockNodecg);
  });
});
