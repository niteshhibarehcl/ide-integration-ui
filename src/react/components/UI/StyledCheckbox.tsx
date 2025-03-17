import { Checkbox, CheckboxProps } from "@mui/material";
import React from "react";
import StyledFormControlLabel from "./StyledFormControlLabel";

interface StyledCheckboxProps extends CheckboxProps {
  /**
   * The label to display alongside the checkbox.
   */
  label: string;
}

/**
 * A reusable and styled Checkbox component based on Material-UI's Checkbox.
 * Provides default styling and supports all props available to Material-UI's Checkbox.
 *  @param {StyledCheckboxProps} props - Props for the StyledCheckbox component.
 *  @returns {JSX.Element} A styled checkbox with a label.
 *
 *  @example
 * <StyledCheckbox
 *   label="Accept terms and conditions"
 *   checked={isChecked}
 *   onChange={handleCheckboxChange}
 * />
 */
const StyledCheckbox: React.FC<StyledCheckboxProps> = ({
  size = "small",
  label,
  ...props
}) => {
  return (
    <StyledFormControlLabel
      label={label}
      control={<Checkbox size={size} {...props} />}
    ></StyledFormControlLabel>
  );
};

export default StyledCheckbox;
