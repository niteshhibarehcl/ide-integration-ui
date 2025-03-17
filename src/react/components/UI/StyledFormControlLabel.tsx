import {
  FormControlLabel,
  FormControlLabelProps,
  Typography,
} from "@mui/material";
import React from "react";

/**
 * A styled FormControlLabel component that displays a label with a Typography component.
 *
 * @param {*} props - Props for the `StyledFormControlLabel` component.
 * @returns {JSX.Element} A styled `FormControlLabel` component.
 *
 * @example
 * <StyledFormControlLabel
 *   control={<Checkbox />}
 *   label="I agree to the terms and conditions"
 * />
 */
const StyledFormControlLabel: React.FC<FormControlLabelProps> = (props) => {
  const { label, ...rest } = props;
  return (
    <FormControlLabel
      label={<Typography variant="body2">{label}</Typography>}
      {...rest}
    ></FormControlLabel>
  );
};
export default StyledFormControlLabel;
