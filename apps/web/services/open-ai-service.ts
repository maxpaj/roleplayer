import OpenAI from "openai";
import { ItemDefinitionRecord } from "@/db/schema/items";
import { UserRecord } from "@/db/schema/users";
import { WorldAggregated } from "./data-mapper";

export class GenerationService {
  async getItemDescription(world: WorldAggregated, item: ItemDefinitionRecord, user: UserRecord) {
    if (!user || !user.openAiApiToken) {
      throw new Error("No OpenAI API token found. Please set it in your profile.");
    }

    const openai = new OpenAI({
      apiKey: user.openAiApiToken,
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant, supplying descriptive texts for content generation of a role playing world.",
        },
        {
          role: "user",
          content: `In a world called "${world.name}", described with the following text; "${world.description}", please give me a description of an item called ${item.name}.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0];
  }
}
