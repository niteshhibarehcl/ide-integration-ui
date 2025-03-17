import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * CustomButton: A styled Material-UI button with additional hover styles.
 * Inherits all styles and behaviors from Material-UI's `Button` component.
 */
const CustomButton = styled(Button)<ButtonProps>(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

/**
 * DefaultButtonProps: Default properties applied to all StyledButton components.
 */
const DefaultButtonProps: Partial<ButtonProps> = {
  variant: "outlined",
  color: "primary",
  size: "medium",
};

/**
 * A reusable and styled Button component based on Material-UI's Button.
 *
 * @param {ButtonProps} props - Props passed to the button component.
 * @returns {JSX.Element} The styled button component.
 *
 * @example
 * <StyledButton onClick={() => alert("Clicked!")}>Click Me</StyledButton>
 */
const StyledButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  // Merge default props with provided props, giving precedence to provided props
  const combinedProps = { ...DefaultButtonProps, ...props };
  return <CustomButton {...combinedProps}>{children}</CustomButton>;
};

export default StyledButton;
