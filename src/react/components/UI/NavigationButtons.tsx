import { ButtonGroup, Stack } from "@mui/material";
import React from "react";
import StyledButton from "./StyledButton";

/**
 * Props for the NavigationButtons component.
 * @interface NavigationButtonsProps
 * @property {number} activeStep - The current active step in the navigation process.
 * @property {string[]} steps - The array of step names.
 * @property {() => void} handleNext - Function to handle the "Next" button click.
 * @property {() => void} handleBack - Function to handle the "Back" button click.
 * @property {() => void} handleFinish - Function to handle the "Finish" button click.
 * @property {() => void} handleCancel - Function to handle the "Cancel" button click.
 */
interface NavigationButtonsProps {
  activeStep: number;
  steps: string[];
  handleNext: () => void;
  handleBack: () => void;
  handleFinish: () => void;
  handleCancel: () => void;
}

const NavigationButtons = ({
  activeStep,
  steps,
  handleNext,
  handleBack,
  handleFinish,
  handleCancel,
}: NavigationButtonsProps) => {
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  return (
    <Stack spacing={4} direction="row" p={10}>
      <Stack spacing={2} direction="row">
        <ButtonGroup
          sx={{
            gap: 1, // Adds uniform space between buttons
          }}
        >
          <StyledButton disabled={isFirstStep} onClick={handleBack}>
            Back
          </StyledButton>
          <StyledButton disabled={isLastStep} onClick={handleNext}>
            Next
          </StyledButton>
          <StyledButton disabled={!isLastStep} onClick={handleFinish}>
            Finish
          </StyledButton>
          <StyledButton onClick={handleCancel}>Cancel</StyledButton>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
};

export default NavigationButtons;
