const { TestEnvironment } = require("../testEnvironment");
const { StepFunctionsClient } = require("./stepFunctionsClient");

describe("StepFunctionsClient", () => {
  test("x", async () => {
    const thing = await new TestEnvironment({
      testConfigFilePath: "./MockConfigFile.json",
    }).init();

    const client = thing.getClient();

    console.log("client!", client)
  });
});
