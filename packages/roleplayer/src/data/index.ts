import { DnDRuleset } from "./rulesets/dnd-5th";
import { LeagueOfDungeoneersRuleset } from "./rulesets/league-of-dungeoneers";

export * from "./rulesets/dnd-5th";
export * from "./rulesets/league-of-dungeoneers";

export function getRuleSet(ruleset: string) {
  switch (ruleset) {
    case "DnD5th":
      return new DnDRuleset();
    case "LeagueOfDungeoneers":
      return new LeagueOfDungeoneersRuleset();
    default:
      throw new Error("Unknown ruleset");
  }
}
