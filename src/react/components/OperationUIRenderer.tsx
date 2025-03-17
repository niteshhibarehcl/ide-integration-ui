import React, { useEffect, useState } from "react";
import OperationComponentRegistry from "./operationComponentRegistry";
import DefaultOperation from "./operations/DefaultOperation";
import { FormProvider } from "./UI/context/FormContext";

/**
 * A React functional component that dynamically renders the appropriate UI component
 * based on the operation name received from the Electron API.
 * If no matching component is found, a default operation UI is rendered.
 *
 * @returns {*} The dynamically rendered operation UI component.
 */
const OperationUIRenderer: React.FC = () => {
  const [SelectedComponent, setSelectedComponent] = useState<React.FC | null>(
    null
  );

  useEffect(() => {
    /**
     * Handles operation name events from Electron API by dynamically selecting
     * the corresponding component from the registry.
     *
     * @param {string} name - The operation name received from Electron.
     */
    const handleOperationName = (name: string) => {
      console.log(`Received operation name: ${name}`);
      const component = OperationComponentRegistry[name] || null;

      if (!component) {
        console.warn(`No component mapped for operation name: ${name}`);
      }

      setSelectedComponent(() => component);
    };

    // Subscribe to the operation name events
    window.electronApi.onOperationRequested(handleOperationName);
  }, []);

  return (
    <FormProvider>
      {SelectedComponent ? <SelectedComponent /> : <DefaultOperation />}
    </FormProvider>
  );
};

export default OperationUIRenderer;
