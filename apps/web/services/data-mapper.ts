import { ActionRecord, RequiredResourceRecord, TargetTypeEnum } from "@/db/schema/actions";
import { CampaignRecord } from "@/db/schema/campaigns";
import { CharacterClassRecord, CharacterRecord } from "@/db/schema/characters";
import { ClazzRecord } from "@/db/schema/classes";
import { EffectRecord } from "@/db/schema/effects";
import { EventRecord } from "@/db/schema/events";
import { ItemDefinitionRecord } from "@/db/schema/items";
import { RaceRecord } from "@/db/schema/races";
import { StatusRecord } from "@/db/schema/statuses";
import { WorldRecord } from "@/db/schema/worlds";
import {
  Actor,
  CampaignEventDispatcher,
  CampaignEventWithRound,
  CharacterResource,
  DnDRuleset,
  EffectEvent,
  EffectParameters,
  ItemDefinition,
  ItemEquipmentType,
  ItemType,
  Rarity,
  Ruleset,
  TargetType,
  World,
} from "roleplayer";
import { Roleplayer } from "../../../packages/roleplayer/src/core/roleplayer";

export type CampaignAggregated = CampaignRecord & {
  events: EventRecord[];
  characters: CharacterRecord[];
  world: WorldAggregated;
};

export type WorldAggregated = WorldRecord & {
  campaigns: CampaignRecord[];
  characters: ActorAggregated[];
  statuses: StatusAggregated[];
  itemTemplates: ItemAggregated[];
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

export function mapCampaignWorldData(worldData: WorldAggregated, campaignData: CampaignAggregated) {
  const Ruleset = new DnDRuleset((str) => {
    const [, staticValue = "0"] = str.split("+");
    return 2 + +staticValue;
  });
  const worldMappedCharacters = worldData.characters.map(mapCharacterRecordToActor);
  const worldMappedItems = worldData.itemTemplates.map(mapItemDefinition);
  const world = new World(Ruleset, worldData.name, {
    ...(worldData as unknown as Partial<World>),
    characters: worldMappedCharacters,
    itemTemplates: worldMappedItems,
  });

  const roleplayer = new Roleplayer({
    roll: () => {
      throw new Error("No rolls allowed back end");
    },
    events: campaignData.events.map((e) => e.eventData as CampaignEventWithRound),
  });

  const campaign = new CampaignEventDispatcher({
    ...campaignData,
    world,
    roleplayer,
  });

  return { world, campaign };
}

export function mapEffectApply(effect: EffectRecord) {
  return {
    eventType: effect.type as EffectEvent["eventType"],
    parameters: effect.parameters as EffectParameters<EffectEvent["eventType"]>,
  };
}

export function mapItemDefinition(item: ItemAggregated): ItemDefinition {
  const actionsMapped = item.actions.map((a) => ({
    ...a,
    eligibleTargets: a.eligibleTargets.map((t) => TargetType[t.enumName as TargetType]),
    appliesEffects: a.appliesEffects.map(mapEffectApply),
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

export function mapCharacterRecordToActor(actor: ActorAggregated): Actor {
  return new Actor({
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
      appliesEffects: a.appliesEffects.map(mapEffectApply),
      eligibleTargets: a.eligibleTargets.map((t) => TargetType[t.enumName as TargetType]),
    })),
  });
}

export function mapCharactersFromCampaignData(ruleset: Ruleset, characters: ActorAggregated[]) {
  return characters.map(mapCharacterRecordToActor);
}

export function mapWorldFromCampaignData(campaignData: CampaignAggregated) {
  const world = new World(
    new DnDRuleset(() => {
      throw new Error("No rolls allowed back end");
    }),
    "",
    {
      ...campaignData.world,
      itemTemplates: [],
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
