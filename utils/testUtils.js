sleep = async (millis) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};

module.exports = { sleep };
