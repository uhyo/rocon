const { getBabelConfig } = require("./configs/babel");

module.exports = (api) => {
  api.cache(true);
  return getBabelConfig(false, true);
};
