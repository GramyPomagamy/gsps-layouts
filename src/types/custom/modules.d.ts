import { TaggedLogger } from "src/extension/util/tagged-logger";
import { NodeCGServer } from "./nodecg";

export type ModuleParams<TConfig> = {
    config: TConfig;
    logger: TaggedLogger;
    nodecg: NodeCGServer;
};

export type LoadableModule<TConfig> = {
    // idk why this is needed but it is
    // eslint-disable-next-line no-unused-vars
    setup: (params: ModuleParams<TConfig>) => Promise<void> | void;
};

export type ModuleDefinition<TConfig> = {
    config: TConfig;
    enabled: boolean;
    loadFn: () => Promise<LoadableModule<TConfig>>;
    name: string;
};