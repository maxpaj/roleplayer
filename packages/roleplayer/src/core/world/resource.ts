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

export const MovementSpeedResourceTypeName = "Movement speed";
export const HealthResourceTypeName = "Health";
export const InitiativeResourceTypeName = "Initiative";
export const PrimaryActionResourceTypeName = "Primary action";
export const SecondaryActionResourceTypeName = "Secondary action";
