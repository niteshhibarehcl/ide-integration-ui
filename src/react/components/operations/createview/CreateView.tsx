import React, { useEffect, useState } from "react";
import { Box, Divider } from "@mui/material";

import ViewStreamDetails from "./ViewStreamDetails";
import ViewTypeDetails from "./ViewTypeDetails";
import ViewPathDetails from "./ViewPathDetails";
import NavigationButtons from "../../UI/NavigationButtons";
import AppStepper from "../../UI/AppStepper";
import { Constants } from "../../../../shared/constants";
import { useFormContext } from "../../UI/context/FormContext";
import AppNotification from "../../UI/AppNotification";

/**
 * List of steps for the "Create View" process.
 */
const viewSteps = ["Step 1", "Step 2", "Step 3"];

/**
 * A React functional component for the "Create View" workflow.
 * It provides a multi-step form interface for creating view.
 *
 * @returns {JSX.Element}
 */
const CreateView = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { getFeatureFormData, updateFeatureFormData } = useFormContext();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info", // "success" or "error"
  });

  useEffect(() => {
    document.title = "Create View - IDE Integration";
    initializeDefaultValues();
  }, []);

  /**
   * Initializes default form values for the "Create View" operation.
   */
  const initializeDefaultValues = () => {
    updateFeatureFormData(
      Constants.OPERATION_NAMES.CREATE_VIEW,
      "textMode",
      "TRANSPARENT"
    );
    updateFeatureFormData(
      Constants.OPERATION_NAMES.CREATE_VIEW,
      "viewType",
      "web"
    );
  };

  /**
   * Handles navigation to the next step in the workflow.
   */
  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, viewSteps.length - 1));
  };

  /**
   * Handles navigation to the previous step in the workflow.
   */
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  /**
   * Handles the submission of the "Create View" operation.
   */
  const handleCreateView = async () => {
    const requestData = getFeatureFormData(
      Constants.OPERATION_NAMES.CREATE_VIEW
    );
    try {
      const apiResponse: string = await window.electronApi.finish(
        Constants.OPERATION_NAMES.CREATE_VIEW,
        requestData
      );
      handleApiResponse(apiResponse);
    } catch (error) {
      console.error("Error during Create View API call:", error);
      showNotification("An error occurred while creating the view.", "error");
    }
  };

  /**
   * Handles the cancellation of the "Create View" operation.
   */
  const handleCancel = () => {
    window.electronApi.cancel();
  };

  /**
   * Handles the API response for the "Create View" operation.
   * @param {string} apiResponse - The API response as a string.
   */
  const handleApiResponse = (apiResponse: string) => {
    try {
      console.log("apiResponse in handleApiResponse:", apiResponse);
      if (apiResponse) {
        showNotification(apiResponse, "error");
      }
    } catch (error) {
      console.error("Failed to parse API response:", error);
      showNotification("An error occurred while creating the view.", "error");
    }
  };

  /**
   * Displays a notification to the user.
   *
   * @param {string} message - The notification message.
   * @param {"info" | "success" | "error"} severity - The notification severity level.
   */
  const showNotification = (
    message: string,
    severity: "info" | "success" | "error"
  ) => {
    setNotification({ open: true, message, severity });
  };

  /**
   * Closes the notification.
   */
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  /**
   * Renders the current step's content based on the active step index.
   *
   * @param {number} step - The current step index.
   * @returns {JSX.Element | null}
   */
  const renderCreateView = (step: number) => {
    switch (step) {
      case 0:
        return <ViewTypeDetails />;

      case 1:
        return <ViewStreamDetails />;

      case 2:
        return <ViewPathDetails />;
    }
  };

  return (
    <Box width={"100%"}>
      <AppStepper activeStep={activeStep} steps={viewSteps} />
      <Divider />
      {renderCreateView(activeStep)}
      <Divider />
      <NavigationButtons
        activeStep={activeStep}
        steps={viewSteps}
        handleNext={handleNext}
        handleBack={handleBack}
        handleFinish={handleCreateView}
        handleCancel={handleCancel}
      />
      <AppNotification
        open={notification.open}
        message={notification.message}
        severity={notification.severity as "success" | "error"}
        onClose={handleNotificationClose}
      />
    </Box>
  );
};

export default CreateView;
