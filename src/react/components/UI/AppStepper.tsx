import React from "react";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";

/**
 * AppStepper: A stepper component that displays the current step in a multi-step process.
 *
 * @interface StepperProps
 * @typedef {StepperProps}
 */
interface StepperProps {
  /**
   * Represents the number steps in the process.
   */
  steps: string[];

  /**
   * Represents the current active step in the process.
   */
  activeStep: number;
}

/**
 * A reusable Stepper component that displays the current step in a multi-step process.
 *
 * @param {StepperProps} props - The properties of the stepper component.
 * @returns {*}
 */
const AppStepper = ({ steps, activeStep }: StepperProps) => {
  // Common styles for the stepper labels
  const labelStyles = (isActive: boolean) => ({
    color: "white",
    fontWeight: isActive ? "bold" : "normal",
    fontSize: "0.875rem",
  });
  return (
    <Box
      bgcolor="#1565c0"
      height={"60px"}
      width={"100%"}
      p={1}
      role="navigation"
      aria-label="Step Progress Navigation"
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ backgroundColor: "transparent", paddingY: 1 }}
      >
        {steps.map((stepLabel, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography sx={labelStyles(index === activeStep)}>
                {stepLabel}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default AppStepper;
