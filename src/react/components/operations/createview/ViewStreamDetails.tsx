import React, { useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { useFormContext } from "../../UI/context/FormContext";
import { Constants } from "../../../../shared/constants";
import StyledCheckbox from "../../UI/StyledCheckbox";
import StyledTextField from "../../UI/StyledTextField";
import StyledButton from "../../UI/StyledButton";

/**
 * Key used for persisting the stream identifier state in session storage.
 */
const STREAM_CHECKBOX_IDENTIFIER_KEY = "streamIdentifier";
/**
 * A component for rendering ClearCase UCM stream details.
 * This component provides functionality for selecting or manually entering
 * a ClearCase UCM stream to create a view. It includes a checkbox to enable
 * manual entry, a text field for entering a stream identifier
 * Connect button is available to connect to the CCRC server
 */
const ViewStreamDetails: React.FC = () => {
  // Context methods to manage form data
  const { updateFeatureFormData, getFeatureFormData } = useFormContext();
  const formData = getFeatureFormData(Constants.OPERATION_NAMES.CREATE_VIEW);
  const [isStreamIdentifierEnabled, setIsStreamIdentifierEnabled] = useState(
    sessionStorage.getItem(STREAM_CHECKBOX_IDENTIFIER_KEY) === "true" || false
  );

  const [streamSelector, setStreamSelector] = useState<string>(
    formData.streamSelector || ""
  );

  /**
   * Handles the change event for the "Stream Identifier" checkbox.
   * Persists the state in session storage and updates the local state.
   *
   * @param {React.SyntheticEvent<Element, Event>} event - The change event from the checkbox.
   * @param {boolean} checked - The current checked state of the checkbox.
   */
  const handleStreamIdentifierChange = (
    event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    sessionStorage.setItem(STREAM_CHECKBOX_IDENTIFIER_KEY, checked.toString());
    setIsStreamIdentifierEnabled(checked);
  };

  /**
   * Handles the change event for the stream selector text field.
   * Updates the form context and the local state
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the text field.
   */
  const handleStreamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateFeatureFormData(
      Constants.OPERATION_NAMES.CREATE_VIEW,
      "streamSelector",
      value
    );
    setStreamSelector(value);
  };

  return (
    <Box p={2} display="flex" flexDirection="column" gap={2}>
      {/* Header */}
      <Typography variant="subtitle2" fontWeight="bold">
        Choose a ClearCase UCM stream
      </Typography>
      <Typography variant="body2">
        Select the stream on which you would like to create your view.
      </Typography>
      <Divider />

      {/* Tree View Section */}
      <Typography variant="body2">
        Select the stream for your new view:
      </Typography>
      <Box>
        {/* Placeholder for Tree View */}
        {/* <SimpleTreeView>
          <TreeItem itemId="cc" label="ClearCase Local">
            <TreeItem itemId="cc.projvobs" label="CC Project VOBs">
              <TreeItem itemId="cc.projects" label="CC Project1" />
            </TreeItem>
          </TreeItem>
        </SimpleTreeView> */}
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <StyledButton variant="contained">Connect</StyledButton>
      </Box>
      <StyledCheckbox
        label="Let me enter an identifier for my stream."
        checked={isStreamIdentifierEnabled}
        onChange={handleStreamIdentifierChange}
      />
      {isStreamIdentifierEnabled && (
        <StyledTextField
          label="Stream Identifier"
          value={streamSelector}
          onChange={handleStreamChange}
        />
      )}
    </Box>
  );
};

export default ViewStreamDetails;
