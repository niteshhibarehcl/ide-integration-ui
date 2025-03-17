import React from "react";
import ReactDOM from "react-dom/client";
import App from "./react/App";

/**
 * Initializes the React application by rendering the root component (`App`) into the DOM.
 * The root element is identified using its `id` attribute ("root").
 * @example
 * // HTML structure:
 * // <div id="root"></div>
 * @returns {void}
 */
const initializeReactApp = (): void => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Failed to initialize the React application. Ensure the HTML contains a <div> element with id 'root'.");
  }
  
  // Create a React root and render the App component.
  ReactDOM.createRoot(rootElement).render(<App />);
};

// Start the React application
initializeReactApp();
