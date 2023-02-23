const ExecutionStatus = {
    RUNNING: "RUNNING",
    SUCCEEDED: "SUCCEEDED",
    FAILED: "FAILED",
    TIMEDOUT: "TIMED_OUT",
    ABORTED: "ABORTED",
  };
  
  const TaskType = {
    ExecutionSucceeded: "ExecutionSucceeded",
    ExecutionFailed: "ExecutionFailed",
    LambdaFunctionFailed: "LambdaFunctionFailed"
  }
  
  const awsAccount = "123456789012";
  const region = "us-east-1";
  const roleARN = `arn:aws:iam::${awsAccount}:role/somerole`;
  const fakeLambdaARN = `arn:aws:lambda:${region}:${awsAccount}:function:mock`;
  
  module.exports = { awsAccount, ExecutionStatus, fakeLambdaARN, region, roleARN, TaskType };