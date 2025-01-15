import type { Id } from "../../lib/generate-id";

export type ResourceDefinition = {
  id: Id;
  name: string;
  defaultMax?: number;
};

/**
 * @module core/actor
 */
export type Resource = {
  resourceTypeId: ResourceDefinition["id"];
  amount: number;
  max: number;
  min: number;
};

/**
 * @module core/actor
 */
export type ResourceGeneration = {
  resourceTypeId: ResourceDefinition["id"];
  amount: number;
};
