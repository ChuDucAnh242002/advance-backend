const fs = require("fs");
const path = require("path");

const configPath = path.resolve("./config.json");

const getConfig = () => {
  try {
    const rawData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading config.json:", error);
    return {};
  }
};

const updateConfig = (newSettings) => {
  try {
    const config = getConfig();
    const updatedConfig = { ...config, ...newSettings };

    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2), "utf-8");

    console.log("Config updated successfully!");
    return updatedConfig;
  } catch (error) {
    console.error("Error updating config.json:", error);
  }
};

module.exports = { getConfig, updateConfig };
