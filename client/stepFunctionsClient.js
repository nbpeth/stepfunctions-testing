
const {
  SFNClient,
  CreateStateMachineCommand,
  StartExecutionCommand,
  GetExecutionHistoryCommand,
  DescribeExecutionCommand,
  ListStateMachinesCommand,
  ListExecutionsCommand,
  DeleteStateMachineCommand,
} = require("@aws-sdk/client-sfn");

const { ExecutionStatus } = require("../constants/stepFunctionsConstants");
const { sleep } = require("../utils/testUtils");

class StepFunctionsClient {
  _internalClient;

  constructor({ host, region }) {
    this._internalClient = new SFNClient({
      endpoint: host,
      region: region,
    });
  }

  execute = (waitTime, maxTries) => async (stateMachineArn, testCase) => {
    console.info("Executing state machine", testCase);

    const startTestResult = await this._internalClient.send(
      new StartExecutionCommand({
        stateMachineArn: getTestExecutionName(stateMachineArn, testCase),
      })
    );

    const { executionArn } = startTestResult;

    return await waitForExecutionCompletion(this._internalClient)(
      executionArn,
      waitTime,
      maxTries
    );
  };

  waitForExecutionCompletion = async (executionArn, waitTime, maxTries) => {
    for (let i = 0; i < maxTries; i++) {
      const { status } = await this._internalClient.send(
        new DescribeExecutionCommand({ executionArn })
      );

      if (status !== ExecutionStatus.RUNNING) {
        const history = await this._internalClient.send(
          new GetExecutionHistoryCommand({ executionArn })
        );
        return { executionArn, history };
      }
      await sleep(waitTime);
    }

    throw Error("Execution ran too long");
  };

  createStateMachine = async ({ definition, name, roleArn }) => {
    return await this._internalClient.send(
      new CreateStateMachineCommand({
        definition,
        name,
        roleArn,
      })
    );
  };

  deleteStateMachine = async (stateMachineArn) => {
    return await this._internalClient.send(
      new DeleteStateMachineCommand(stateMachineArn)
    );
  };

  listStateMachines = async (options = {}) => {
    const stateMachines = await this._internalClient.send(
      new ListStateMachinesCommand(options)
    );

    return stateMachines;
  };

  listExecutions = async ({ stateMachineArn }) => {
    const stateMachines = await this._internalClient.send(
      new ListExecutionsCommand(stateMachineArn)
    );

    return stateMachines;
  };

  getHistoryFrom = async (executionArn) => {
    const history = await this._internalClient.send(
      new GetExecutionHistoryCommand({ executionArn })
    );

    return { executionArn, history };
  };
}

module.exports = { StepFunctionsClient };
