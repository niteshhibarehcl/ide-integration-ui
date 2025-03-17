import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/**
 * ESLint configuration for a project using JavaScript, TypeScript, and React.
 *
 * @type {{}}
 */
const eslintConfig = [
  // Specify the file extensions to lint
  {
    files: ["**/*.{mjs,cjs,ts,jsx,tsx}"],
  },

  // Set up global variables for Node.js
  {
    languageOptions: {
      globals: globals.node,
    },
  },

  // Include recommended settings for JavaScript
  pluginJs.configs.recommended,

  // Include recommended settings for TypeScript
  ...tseslint.configs.recommended,

  // Include recommended settings for React
  pluginReact.configs.flat.recommended,

  // React-specific settings
  {
    settings: {
      react: {
        version: "detect", // Automatically detects the React version
      },
    },
  },

  // Ignore generated files and dependencies
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];

export default eslintConfig;