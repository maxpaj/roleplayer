import { EventProcessor } from "./processor";

describe("event processor", () => {
  it("should apply middlewares", () => {
    const processor = new EventProcessor();
    const processed = processor.process({
      type: "Unknown",
    });

    expect(processed.type).toBe("RoundStarted");
  });
});
