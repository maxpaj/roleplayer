import { Roll, Ruleset, World } from "..";

/* 
  LIB / FRAMEWORK / CORE
    - event system
      - on level up
      - on action 
      - on new round
      - on long rest
    - level progression system
    - stats system
    - inventory system 
    - character system  
      - resource system 
  
     RULE SET
      - level progression definition (how much xp per level)
      - stat types (STR, DEX, CON, INT, WIS, CHA, what does what?)
      - professions (classes)
      - 
      
       WORLD
        - items (Frost Sword)
        - actions (Frostburn action def) () 
        - spells 
        - classes
        - on level up
        - character equipment slots
  
         CAMPAIGN
          - concrete stuff
          - actual events that happen 
          - frostSword.action(Frostburn action def) -> Frostburn action
  
    */

type RoleplayerConfig = {
  roll: Roll;
};

export class Roleplayer {
  roll: Roll;

  constructor(config: RoleplayerConfig) {
    this.roll = config.roll;
  }

  createWorld(name: string, world: Partial<World>, ruleset: Ruleset) {
    return new World(ruleset, name, world);
  }
}
