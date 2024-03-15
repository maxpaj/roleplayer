import { DefaultRuleSet } from '../../data/data'
import { dangerousGenerateId } from '../../lib/generate-id'
import { Campaign } from '../campaign/campaign'
import { CampaignEvent } from '../campaign/campaign-events'
import { Interaction, TargetType } from '../world/interaction/interaction'
import { Item, ItemSlot, ItemType } from '../world/item/item'
import { Rarity } from '../world/rarity'
import { World } from '../world/world'
import { Character, CharacterResourceType } from './character'

describe('Character', () => {
  describe('Create character events', () => {
    it('should handle create character events', () => {
      const characterA = dangerousGenerateId()
      const characterB = dangerousGenerateId()

      const world = new World({ name: 'World', ruleset: DefaultRuleSet })
      const campaign = new Campaign({ id: 0, name: 'Campaign', world })

      campaign.nextRound()
      campaign.createCharacter(characterA, 'Character A')
      campaign.createCharacter(characterB, 'Character B')

      const data = campaign.applyEvents()
      expect(data.characters.length).toBe(2)
    })

    it('should apply maximum health change events', () => {
      const characterId = dangerousGenerateId()

      const world = new World({ name: 'World', ruleset: DefaultRuleSet })
      const campaign = new Campaign({ id: 0, name: 'Campaign', world })

      campaign.nextRound()
      campaign.createCharacter(characterId, 'Character')

      const events: CampaignEvent[] = [
        {
          type: 'CharacterMaximumHealthSet',
          maximumHealth: 12,
          id: dangerousGenerateId(),
          characterId: characterId,
        },
      ]

      campaign.publishCampaignEvent(...events)

      const data = campaign.applyEvents()
      const characterFromEvents = data.characters.find((c) => c.id === characterId)
      expect(characterFromEvents!.maximumHealth).toBe(12)
    })

    it('should apply movement events', () => {
      const characterId = dangerousGenerateId()
      const world = new World({
        name: 'World',
        ruleset: DefaultRuleSet,
      })
      const campaign = new Campaign({ id: 0, name: 'Campaign', world })

      campaign.nextRound()
      campaign.createCharacter(characterId, 'Character')

      const movementSpeedResource = DefaultRuleSet.characterResourceTypes.find((r) => r.name === 'Movement speed')

      const events: CampaignEvent[] = [
        {
          type: 'CharacterResourceCurrentChange',
          id: dangerousGenerateId(),
          resourceTypeId: movementSpeedResource!.id,
          amount: 35,
          characterId: characterId,
        },
        {
          type: 'CharacterPositionSet',
          id: dangerousGenerateId(),
          targetPosition: {
            x: 10,
            y: 0,
            z: 0,
          },
          characterId: characterId,
        },
        {
          type: 'CharacterMovement',
          targetPosition: {
            x: 10,
            y: 20,
            z: 0,
          },
          id: dangerousGenerateId(),
          characterId: characterId,
        },
      ]

      campaign.publishCampaignEvent(...events)

      const data = campaign.applyEvents()
      const characterFromEvents = data.characters.find((c) => c.id === characterId)
      expect(characterFromEvents!.position.x).toBe(10)
      expect(characterFromEvents!.position.y).toBe(20)
    })

    it('should reject movement event when movement exceeds remaining movement', () => {
      const movementResource: CharacterResourceType = {
        id: dangerousGenerateId(),
        name: 'Movement speed',
      }

      const world = new World({
        name: 'World',
        ruleset: DefaultRuleSet,
      })
      const campaign = new Campaign({ id: 0, name: 'Campaign', world })

      const characterId = dangerousGenerateId()
      const character = new Character({
        resources: [
          {
            amount: 35,
            max: 35,
            min: 0,
            resourceTypeId: movementResource.id,
          },
        ],
      })
      character.id = characterId

      campaign.nextRound()
      campaign.createCharacter(characterId, 'Character')

      const events: CampaignEvent[] = [
        {
          type: 'CharacterResourceCurrentChange',
          id: dangerousGenerateId(),
          amount: 35,
          characterId: characterId,
          resourceTypeId: movementResource.id,
        },
        {
          type: 'CharacterPositionSet',
          id: dangerousGenerateId(),
          targetPosition: {
            x: 10,
            y: 0,
            z: 0,
          },
          characterId: characterId,
        },
        {
          type: 'RoundStarted',
          id: dangerousGenerateId(),
        },
        {
          type: 'CharacterMovement',
          targetPosition: {
            x: 10,
            y: 50,
            z: 0,
          },
          id: dangerousGenerateId(),
          characterId: characterId,
        },
      ]

      campaign.publishCampaignEvent(...events)

      expect(campaign.applyEvents).toThrow()
    })

    it('should apply temporary health change events', () => {
      const characterId = dangerousGenerateId()
      const world = new World({ name: 'World', ruleset: DefaultRuleSet })
      const campaign = new Campaign({ id: 0, name: 'Campaign', world })
      campaign.nextRound()
      campaign.createCharacter(characterId, 'Character')

      const events: CampaignEvent[] = [
        {
          type: 'CharacterMaximumHealthSet',
          maximumHealth: 12,
          id: dangerousGenerateId(),
          characterId: characterId,
        },
        {
          type: 'CharacterHealthSet',
          healthChange: 12,
          id: dangerousGenerateId(),
          characterId: characterId,
        },
        {
          type: 'CharacterHealthLoss',
          healthLoss: 4,
          id: dangerousGenerateId(),
          characterId: characterId,
          interactionId: dangerousGenerateId(),
        },
      ]

      campaign.publishCampaignEvent(...events)

      const data = campaign.applyEvents()
      const characterFromEvents = data.characters.find((c) => c.id === characterId)
      expect(characterFromEvents!.currentHealth).toBe(8)
    })

    it('should apply item gain events', () => {
      const characterId = dangerousGenerateId()
      const itemId = dangerousGenerateId()
      const world = new World({
        name: 'World',
        ruleset: DefaultRuleSet,
        items: [
          {
            id: itemId,
            rarity: Rarity.Common,
            actions: [],
            name: 'Item',
            occupiesSlots: [ItemSlot.Inventory],
            type: ItemType.Equipment,
            description: '',
          },
        ],
      })
      const campaign = new Campaign({ id: 0, name: 'Campaign', world })
      campaign.nextRound()

      campaign.createCharacter(characterId, 'Character')

      const events: CampaignEvent[] = [
        {
          type: 'CharacterSpawned',
          id: dangerousGenerateId(),
          characterId: characterId,
        },
        {
          type: 'CharacterItemGain',
          id: dangerousGenerateId(),
          characterId: characterId,
          itemId: itemId,
        },
      ]

      campaign.publishCampaignEvent(...events)

      const data = campaign.applyEvents()
      const characterFromEvents = data.characters.find((c) => c.id === characterId)
      expect(characterFromEvents!.inventory.length).toBe(1)
    })

    it("should apply reject character events if character doesn't exist", () => {
      const characterId = dangerousGenerateId()
      const world = new World({ name: 'World', ruleset: DefaultRuleSet })
      const campaign = new Campaign({ id: 0, name: 'Campaign', world })
      campaign.nextRound()

      const events: CampaignEvent[] = [
        {
          type: 'CharacterMaximumHealthSet',
          maximumHealth: 12,
          id: dangerousGenerateId(),
          characterId: characterId,
        },
      ]

      campaign.publishCampaignEvent(...events)

      try {
        campaign.applyEvents()
      } catch (e) {
        // Success
      }
    })

    it('should handle unhandled events gracefully', () => {
      const world = new World({ name: 'World', ruleset: DefaultRuleSet })
      const campaign = new Campaign({ id: 0, name: 'New campaign', world })
      const events: CampaignEvent[] = [
        {
          type: 'Unknown',
          id: dangerousGenerateId(),
        },
      ]

      campaign.nextRound()
      campaign.publishCampaignEvent(...events)

      const data = campaign.applyEvents()

      expect(data).toBeDefined()
    })
  })

  describe('Character actions', () => {
    it('should return a list of possible interactions based on the character class abilities, spells and inventory', () => {
      const sword: Item = {
        id: dangerousGenerateId(),
        rarity: Rarity.Common,
        actions: [
          {
            id: dangerousGenerateId(),
            appliesEffects: [],
            eligibleTargets: [TargetType.Hostile],
            name: 'Slash',
            rangeDistanceMeters: 5,
            requiresResources: [],
          },
        ],
        name: 'Sword',
        occupiesSlots: [ItemSlot.MainHand],
        type: ItemType.Equipment,
      }

      const healingWord: Interaction = {
        id: dangerousGenerateId(),
        name: 'Healing Word (Level 1)',
        appliesEffects: [],
        eligibleTargets: [TargetType.Friendly],
        rangeDistanceMeters: 30,
        requiresResources: [],
      }

      const firebolt: Interaction = {
        id: dangerousGenerateId(),
        appliesEffects: [],
        eligibleTargets: [TargetType.Hostile],
        name: 'Firebolt',
        rangeDistanceMeters: 35,
        requiresResources: [
          {
            resourceTypeId: 0,
            amount: 1,
          },
        ],
      }

      const char = new Character()
      char.equipment = [
        {
          slotId: 0,
          item: sword,
        },
      ]

      char.actions = [healingWord, firebolt]

      const actions = char.getAvailableActions()
      expect(actions.length).toBe(3)
    })
  })
})
