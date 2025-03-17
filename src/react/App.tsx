import React from "react";
import OperationUIRenderer from "./components/OperationUIRenderer";
import { Box } from "@mui/material";

/**
 * The root component of the application.
 * This component acts as the entry point for rendering the `OperationUIRenderer` component,
 * which handles the dynamic UI operations.
 *
 * @returns {*}
 */
const App: React.FC = () => {
  return (
    <Box>
      <OperationUIRenderer />
    </Box>
  );
};

export default App;
