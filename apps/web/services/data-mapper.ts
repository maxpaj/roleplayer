import { ActionRecord, TargetTypeEnum, RequiredResourceRecord } from "@/db/schema/actions";
import { CampaignRecord } from "@/db/schema/campaigns";
import { CharacterRecord, CharacterClassRecord } from "@/db/schema/characters";
import { ClazzRecord } from "@/db/schema/classes";
import { EffectRecord } from "@/db/schema/effects";
import { EventRecord } from "@/db/schema/events";
import { ItemDefinitionRecord } from "@/db/schema/items";
import { RaceRecord } from "@/db/schema/races";
import { StatusRecord } from "@/db/schema/statuses";
import { WorldRecord } from "@/db/schema/worlds";
import { Item } from "@radix-ui/react-select";
import {
  CharacterResourceLossEffect,
  Ruleset,
  Actor,
  TargetType,
  World,
  DnDRuleset,
  CharacterResource,
  ItemDefinition,
  ItemType,
  Rarity,
  ItemEquipmentType,
  CharacterStatusGainEffect,
  Campaign,
  CampaignEventWithRound,
} from "roleplayer";
import { effect } from "zod";

export type CampaignAggregated = CampaignRecord & {
  events: EventRecord[];
  characters: CharacterRecord[];
  world: WorldAggregated;
};

export type WorldAggregated = WorldRecord & {
  campaigns: CampaignRecord[];
  characters: ActorAggregated[];
  statuses: StatusAggregated[];
  itemDefinitions: ItemAggregated[];
  classes: ClazzRecord[];
  actions: ActionAggregated[];
  races: RaceRecord[];
};

export type StatusAggregated = StatusRecord & {
  appliesEffects: EffectRecord[];
};

export type ActionAggregated = ActionRecord & {
  appliesEffects: EffectRecord[];
  eligibleTargets: TargetTypeEnum[];
  requiresResources: RequiredResourceRecord[];
};

export type ItemAggregated = ItemDefinitionRecord & {
  actions: ActionAggregated[];
};

export type CharacterClassAggregated = CharacterClassRecord;

export type ActorAggregated = CharacterRecord & {
  resources: CharacterResource[];
  actions: ActionAggregated[];
  classes: CharacterClassAggregated[];
};

function mapActionEffect(effect: EffectRecord) {
  const parameters = effect.parameters as any; // TODO: How can we type this based on CharacterResourceLoss?

  switch (effect.type) {
    case "CharacterResourceLoss": {
      return new CharacterResourceLossEffect(
        parameters.element,
        parameters.variableValue,
        parameters.staticValue,
        parameters.resourceTypeId
      );
    }

    case "CharacterStatusGain": {
      return new CharacterStatusGainEffect(parameters.statusId);
    }

    default:
      throw new Error("Unknown effect type");
  }
}

export function mapCampaignWorldData(worldData: WorldAggregated, campaignData: CampaignAggregated) {
  const Ruleset = new DnDRuleset();
  const worldMappedCharacters = worldData.characters.map((c) => mapCharacterRecordToActor(Ruleset, c));
  const worldMappedItems = worldData.itemDefinitions.map((i) => mapItemDefinition(Ruleset, i));
  const world = new World(Ruleset, worldData.name, {
    ...(worldData as unknown as Partial<World>),
    characters: worldMappedCharacters,
    itemDefinitions: worldMappedItems,
  });

  const campaign = new Campaign({
    ...campaignData,
    world,
    events: campaignData.events.map((e) => e.eventData as CampaignEventWithRound),
  });

  return { world, campaign };
}

export function mapItemDefinition(ruleset: Ruleset, item: ItemAggregated): ItemDefinition {
  const actionsMapped = item.actions.map((a) => ({
    ...a,
    eligibleTargets: a.eligibleTargets.map((t) => TargetType[t.enumName as TargetType]),
    appliesEffects: a.appliesEffects.map(mapActionEffect),
  }));

  return {
    ...item,
    type: ItemType[item.type],
    rarity: Rarity[item.rarity],
    equipmentType: ItemEquipmentType[item.equipmentType],
    stats: [],
    occupiesSlots: [],
    weightUnits: 10,
    actions: actionsMapped,
  };
}

export function mapCharacterRecordToActor(ruleset: Ruleset, actor: ActorAggregated): Actor {
  return new Actor(ruleset, {
    ...actor,
    resources: actor.resources,
    classes: actor.classes.map((c) => ({
      classId: c.classId,
      level: c.level,
    })),
    actions: actor.actions.map((a) => ({
      ...a,
      rangeDistanceUnits: a.rangeDistanceUnits,
      requiresResources: a.requiresResources.map((r) => ({
        resourceTypeId: r.resourceTypeId!,
        amount: r.amount,
      })),
      appliesEffects: a.appliesEffects.map(mapActionEffect),
      eligibleTargets: a.eligibleTargets.map((t) => TargetType[t.enumName as TargetType]),
    })),
  });
}

export function mapCharactersFromCampaignData(ruleset: Ruleset, characters: ActorAggregated[]) {
  return characters.map((char) => mapCharacterRecordToActor(ruleset, char));
}

export function mapWorldFromCampaignData(campaignData: CampaignAggregated) {
  const world = new World(
    new DnDRuleset(() => {
      throw new Error("No rolls allowed back end");
    }),
    "",
    {
      ...campaignData.world,
      itemDefinitions: [],
      characters: [],
      actions: [],
      statuses: [],
      classes: [],
      ruleset: new DnDRuleset(),
    }
  );

  world.characters = mapCharactersFromCampaignData(world.ruleset, campaignData.world.characters);

  return world;
}
