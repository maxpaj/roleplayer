import { generateId } from "../../lib/generate-id";
import { World } from "../world/world";
import {
  Item,
  ItemEquipmentType,
  ItemSlot,
  ItemType,
  Rarity,
} from "../item/item";
import { EffectType, ElementType } from "./effect";
import { Interaction, TargetType } from "./interaction";
import {
  Status,
  StatusApplicationTrigger,
  StatusDurationType,
  StatusType,
} from "./status";
import { WorldEvent } from "../world/world-events";

describe("interactions", () => {
  const frozenStatus: Status = {
    id: generateId(),
    name: "Chill",
    durationRounds: 2,
    durationType: StatusDurationType.NumberOfRounds,
    type: StatusType.Magic,
    appliesEffects: [
      {
        effect: {
          element: ElementType.Cold,
          type: EffectType.HealthLoss,
          amountStatic: 2,
          amountVariable: 0,
        },
        appliesAt: StatusApplicationTrigger.RoundStart,
      },
    ],
  };

  const frostSword: Item = {
    id: generateId(),
    rarity: Rarity.Rare,
    actions: [
      {
        id: generateId(),
        appliesEffects: [
          {
            element: ElementType.Slashing,
            type: EffectType.HealthLoss,
            amountStatic: 2,
            amountVariable: 0,
          },
          {
            element: ElementType.Cold,
            type: EffectType.StatusGain,
            appliesStatusId: frozenStatus.id,
          },
        ],
        eligibleTargets: [TargetType.Hostile],
        name: "Slash",
        rangeDistanceMeters: 5,
        requiresResources: [],
      },
    ],
    name: "Sword of Frost",
    occupiesSlots: [ItemSlot.MainHand],
    type: ItemType.Equipment,
  };

  it("should apply effects from being hit", () => {
    const world = new World({ name: "test" });
    world.nextRound();
    world.statuses = [frozenStatus];
    world.items = [frostSword];

    const action: Interaction = {
      id: generateId(),
      appliesEffects: [
        {
          element: ElementType.Slashing,
          type: EffectType.HealthLoss,
          amountStatic: 2,
          amountVariable: 0,
          appliesStatusId: frozenStatus.id,
        },
      ],
      eligibleTargets: [],
      name: "Slash",
      rangeDistanceMeters: 10,
      requiresResources: [],
    };

    world.actions = [action];

    const equipmentSlot = {
      eligibleEquipmentTypes: [ItemEquipmentType.OneHandSword],
      id: generateId(),
      name: "Main hand",
    };

    world.characterEquipmentSlots = [equipmentSlot];

    const attackerId = generateId();
    const defenderId = generateId();

    world.createCharacter(attackerId, "Attacker");
    world.addCharacterEquipmentSlot(attackerId, equipmentSlot.id);
    world.addCharacterItem(attackerId, frostSword.id);

    world.createCharacter(defenderId, "Defender");
    world.nextRound();

    const events: WorldEvent[] = [
      {
        id: generateId(),
        type: "CharacterHealthChange",
        healthChange: 10,
        characterId: defenderId,
      },
    ];

    world.publishWorldEvent(...events);

    const beforeAttack = world.applyEvents();
    const attacker = beforeAttack.characters.find((c) => c.id === attackerId);
    const defender = beforeAttack.characters.find((c) => c.id === defenderId);
    const actions = attacker!.getAvailableActions();
    const characterAction = actions.find((a) => a.name === "Slash");

    world.performCharacterAttack(attacker!, 15, characterAction!, defender!);

    const afterAttack = world.applyEvents();
    const defenderFromEvents = afterAttack.characters.find(
      (c) => c.id === defenderId
    );

    expect(defenderFromEvents!.currentHealth).toBe(8);
    expect(
      defenderFromEvents!.statuses.find((s) => s.name === "Chill")
    ).toBeDefined();
  });
});
