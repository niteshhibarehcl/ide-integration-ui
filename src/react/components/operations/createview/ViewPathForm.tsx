import { Box } from "@mui/material";
import React from "react";
import StyledTextField from "../../UI/StyledTextField";
import StyledButton from "../../UI/StyledButton";
import StyledCheckbox from "../../UI/StyledCheckbox";

/**
 * Props for the `ViewPathForm` component.
 */
interface ViewPathFormProps {
  viewTag: string;
  viewStoragePath: string;
  isProjectComponentEnabled: boolean;
  handleViewTagChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleViewOptions: () => void;
  handleCopyAreaPathChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleBrowseButton: () => void;
  handleProjectComponentChange: (
    event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => void;
}

/**
 * A React functional component that renders the view path form for the "Create View" operation.
 * @returns {*}
 */
const ViewPathForm = ({
  viewTag,
  handleViewTagChange,
  toggleViewOptions,
  viewStoragePath,
  handleCopyAreaPathChange,
  handleBrowseButton,
  isProjectComponentEnabled,
  handleProjectComponentChange,
}: ViewPathFormProps) => {
  return (
    <Box display="flex" flexDirection="column" gap={2} p={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <StyledTextField
          label="View tag"
          onChange={handleViewTagChange}
          value={viewTag}
          fullWidth
          sx={{ flexGrow: 1 }}
        />
        <StyledButton
          variant="contained"
          onClick={toggleViewOptions}
          sx={{ textTransform: "none", padding: "6px 12px", flexShrink: 0 }}
        >
          View Options...
        </StyledButton>
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        <StyledTextField
          label="View location"
          value={viewStoragePath}
          onChange={handleCopyAreaPathChange}
          fullWidth
          sx={{ flexGrow: 1 }}
        />
        <StyledButton
          variant="contained"
          onClick={handleBrowseButton}
          sx={{ textTransform: "none", padding: "6px 12px", flexShrink: 0 }}
        >
          Browse
        </StyledButton>
      </Box>
      <Box>
        <StyledCheckbox
          checked={isProjectComponentEnabled}
          label="By default, select all the project components for loading in the
                view."
          onChange={handleProjectComponentChange}
        />
      </Box>
    </Box>
  );
};

export default ViewPathForm;
