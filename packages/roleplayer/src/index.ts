export * from "./core/actor/character";
export * from "./core/battle/battle";
export * from "./core/campaign/campaign";
export * from "./core/campaign/campaign-events";
export * from "./core/campaign/campaign-state";
export * from "./core/campaign/round";
export * from "./core/dice/dice";
export * from "./core/ruleset/ruleset";
export * from "./core/action/action";
export * from "./core/action/effect";
export * from "./core/inventory/item";
export * from "./core/world/rarity";
export * from "./core/world/world";
export * from "./lib/generate-id";
export * from "./data";

// TODO: Should be injected at build/runtime time
export const Version = "0.0.0";
