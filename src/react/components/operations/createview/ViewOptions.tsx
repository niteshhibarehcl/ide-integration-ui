import { Box, Divider, Typography } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import StyledButton from "../../UI/StyledButton";
import { useFormContext } from "../../UI/context/FormContext";
import { Constants } from "../../../../shared/constants";
import StyledRadioGroup from "../../UI/StyledRadioGroup";

/**
 * Props for the `ViewOptions` component.
 */
interface ViewOptionsProps {
  /**
   * Function to handle closing the view options drawer.
   */
  handleCloseViewOptions: () => void;
}

/**
 * A React functional component that renders view options for creating a view.
 * Users can select the Text Mode, such as Transparent, Windows, or Unix.
 *
 * @param {ViewOptionsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered ViewOptions component.
 */
const ViewOptions = (props: ViewOptionsProps) => {
  const { updateFeatureFormData, getFeatureFormData } = useFormContext();
  const formData = getFeatureFormData(Constants.OPERATION_NAMES.CREATE_VIEW);
  const [textMode, setTextMode] = useState(formData.textMode || "TRANSPARENT");

  /**
   * Handles changes to the text mode selection.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The event triggered by changing the radio button selection.
   */
  const changeTextModeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const newTextMode = event.target.value;
    setTextMode(newTextMode);
  };

  /**
   * Apply the changes of Text Mode and close the drawer.
   */
  const submitViewOptions = () => {
    updateFeatureFormData(
      Constants.OPERATION_NAMES.CREATE_VIEW,
      "textMode",
      textMode
    );
    props.handleCloseViewOptions();
  };

  /**
   * Options for the Text Mode radio group.
   *
   * @type {{}}
   */
  const textModeOptions = [
    {
      label: "Transparent (Do not alter file content)",
      value: "TRANSPARENT",
    },
    {
      label: "Windows (Convert LF to CR/LF pairs)",
      value: "INSERT_CR",
    },
    {
      label: "Unix (Convert CR/LF pairs to LF only)",
      value: "STRIP_CR",
    },
  ];
  return (
    <Box>
      <Box p={2} height={"50px"}>
        <Typography variant="subtitle2" fontWeight={"bold"} gutterBottom>
          View Options
        </Typography>
        <Typography variant="body2" sx={{ color: "black" }} gutterBottom>
          Set the values of any additional view options.
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <StyledRadioGroup
          name="text-mode-group"
          formLabelId="text-mode-group-label"
          aria-labelledby="text-mode-group-label"
          label="Interop Text Mode (for mixed UNIX/Windows environments)"
          options={textModeOptions}
          value={textMode}
          onChange={changeTextModeHandler}
        />
      </Box>
      <Divider />
      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <StyledButton onClick={submitViewOptions}>Ok</StyledButton>
        <StyledButton onClick={props.handleCloseViewOptions}>
          Cancel
        </StyledButton>
      </Box>
    </Box>
  );
};

export default ViewOptions;
