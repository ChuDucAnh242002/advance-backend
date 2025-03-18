import fs from "fs";
import path from "path";

const configPath = path.resolve("./config.json");

// Function to read the config file
export const getConfig = () => {
  try {
    const rawData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading config.json:", error);
    return {};
  }
};

// Function to update settings
export const updateConfig = (newSettings) => {
  try {
    const config = getConfig(); // Get current config
    const updatedConfig = { ...config, ...newSettings };

    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2), "utf-8");

    console.log("Config updated successfully!");
    return updatedConfig;
  } catch (error) {
    console.error("Error updating config.json:", error);
  }
};
