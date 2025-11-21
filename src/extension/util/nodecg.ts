import type NodeCG from "@nodecg/types";
import { type Configschema } from "../../types/generated";

let nodecg: NodeCG.ServerAPI<Configschema>;
export type NodeCGServer = NodeCG.ServerAPI<Configschema>;

export function set(ctx: NodeCG.ServerAPI<Configschema>): void {
  nodecg = ctx;
}

export function get(): NodeCG.ServerAPI<Configschema> {
  return nodecg;
}
