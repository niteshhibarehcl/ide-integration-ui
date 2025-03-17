import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

/**
 * A reusable styled `TextField` component based on Material-UI's `TextField`.
 * Provides consistent styling and supports all props available to Material-UI's `TextField`.
 * @param {TextFieldProps} props - Props for the `StyledTextField` component.
 * @returns {JSX.Element} The styled text field component.
 *
 * @example
 * <StyledTextField
 *   label="Enter your name"
 *   value={value}
 *   onChange={handleChange}
 * />
 */
const StyledTextField: React.FC<TextFieldProps> = ({
  variant = "outlined",
  size = "small",
  ...props
}) => (
  <TextField
    variant={variant}
    size={size}
    sx={{
      "& .MuiInputLabel-root": { fontSize: "13px" },
      "& .MuiInputBase-input": { fontSize: "13px" },
    }}
    {...props}
  />
);

export default StyledTextField;
