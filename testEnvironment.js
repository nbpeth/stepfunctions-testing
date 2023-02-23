const path = require("path");
const { DockerComposeEnvironment } = require("testcontainers");
const { StepFunctionsClient } = require("./client/stepFunctionsClient");

const _defaultHost = "localhost";
const _defaultHostPort = "8083";
const _stepFunctionsLocalPort = "8083";
const _defaultRegion = "us-west-2";

class TestEnvironment {
  _environment;
  _client;
 

  _testConfigFilePath;
  _host;
  _hostPort;
  _region;

  constructor({ testConfigFilePath, host, port, region }) {
    if (!testConfigFilePath) {
      throw new Error("Test Config File is required");
    }

    this._testConfigFilePath = testConfigFilePath;
    this._hostPort = port ? port : _defaultHostPort;
    this._host = host ? host : _defaultHost;
    this._region = region ? region : _defaultRegion;
  }

  init = async () => {
    const composeFilePath = path.resolve(__dirname);
    const composeFile = "docker-compose.yml";

    this._environment = await new DockerComposeEnvironment(
      composeFilePath,
      composeFile
    )
      .withEnvironment(
        { TEST_CONFIGURATION_FILE_PATH: this._testConfigFilePath },
        { AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID },
        { AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY }, // dummy values maybe
        { AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN },
        { AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION }
      )
      .withBuild()
      .up();

    this._client = new StepFunctionsClient({
      host: this.getHostName(),
      region: this.region,
    });

    return this;
  };

  getHostName = () => {
    return `http://${this._host}:${this._hostPort}`;
  };

  tearDown = async () => {
    return await this._environment.down();
  };

  getClient = () => {
    return this._client;
  };
}

module.exports = { TestEnvironment };
