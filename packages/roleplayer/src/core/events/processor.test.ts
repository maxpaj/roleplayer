import { EventProcessor } from "./processor";

describe("event processor", () => {
  it("should apply middlewares", async () => {
    const processor = new EventProcessor();
    const processed = await processor.process({
      type: "Unknown",
    });

    expect(processed.type).toBe("RoundStarted");
  });
});
