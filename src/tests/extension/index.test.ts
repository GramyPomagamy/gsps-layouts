import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createMockNodeCG, type MockNodeCG } from "../helpers";
import extensionLoader from "../../extension/index.js";
import { defineModules } from "../../extension/modules/index.js";
import { TaggedLogger } from "../../extension/util/tagged-logger.js";

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

describe("Extension Loader", () => {
  let mockNodecg: MockNodeCG;
  let mockSetup: Mock;
  let mockSetupDisabled: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNodecg = createMockNodeCG();
    mockSetup = vi.fn();
    mockSetupDisabled = vi.fn();
  });

  it("should load enabled modules and skip disabled ones", async () => {
    (defineModules as Mock).mockReturnValue({
      enabledModule: {
        name: "Enabled Module",
        enabled: true,
        config: { foo: "bar" },
        loadFn: vi.fn().mockResolvedValue({ setup: mockSetup }),
      },
      disabledModule: {
        name: "Disabled Module",
        enabled: false,
        config: {},
        loadFn: vi.fn().mockResolvedValue({ setup: mockSetupDisabled }),
      },
    });

    await extensionLoader(mockNodecg);

    expect(defineModules).toHaveBeenCalledWith(mockNodecg);
    expect(mockSetup).toHaveBeenCalledWith({
      nodecg: mockNodecg,
      config: { foo: "bar" },
      logger: expect.any(Object),
    });
    expect(mockSetupDisabled).not.toHaveBeenCalled();
    expect(TaggedLogger).toHaveBeenCalledWith("Enabled Module", mockNodecg);
  });

  it("should load multiple modules in parallel", async () => {
    const setupA = vi.fn();
    const setupB = vi.fn();

    (defineModules as Mock).mockReturnValue({
      moduleA: {
        name: "Module A",
        enabled: true,
        config: { a: 1 },
        loadFn: vi.fn().mockResolvedValue({ setup: setupA }),
      },
      moduleB: {
        name: "Module B",
        enabled: true,
        config: { b: 2 },
        loadFn: vi.fn().mockResolvedValue({ setup: setupB }),
      },
    });

    await extensionLoader(mockNodecg);

    expect(setupA).toHaveBeenCalled();
    expect(setupB).toHaveBeenCalled();
  });

  it("should catch and log errors without crashing", async () => {
    mockSetup.mockRejectedValue(new Error("Module failed"));

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
    expect(TaggedLogger).toHaveBeenCalledWith("Failing Module", mockNodecg);
  });
});
