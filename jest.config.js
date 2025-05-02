export default {
  preset: "ts-jest/presets/default-esm", // Use the ESM preset for ts-jest
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  extensionsToTreatAsEsm: [".ts"], // Treat .ts files as ESM
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }], // Ensure ts-jest handles ESM
  },
};
