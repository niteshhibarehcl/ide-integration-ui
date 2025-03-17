import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
  Typography,
} from "@mui/material";
import React from "react";
import StyledFormControlLabel from "./StyledFormControlLabel";

/**
 * Props of `RadioGroupProps` component with additional custom props.
 */
interface StyledRadioGroupProps extends RadioGroupProps {
  /**
   * The label for the radio group.
   */
  label: string;

  /**
   * The options to display as radio buttons.
   * Each option contains a `label` and `value`.
   */
  options: { label: string; value: string }[];

  /**
   * The ID for the form label, used for accessibility.
   */
  formLabelId: string;
}

/**
 * A reusable styled `RadioGroup` component with custom styling and enhanced accessibility.
 * @param {{ [x: string]: any; }} param0....props - Additional props passed to the RadioGroup component.
 * @returns {JSX.Element} The styled radio group component.
 * @example
 * <StyledRadioGroup
 *   label="Select your preference"
 *   formLabelId="preference-label"
 *   options={[
 *     { label: "Option 1", value: "option1" },
 *     { label: "Option 2", value: "option2" },
 *   ]}
 *   value={selectedValue}
 *   onChange={handleChange}
 * />
 */
const StyledRadioGroup: React.FC<StyledRadioGroupProps> = ({
  label,
  options,
  formLabelId,
  ...props
}) => (
  <FormControl component="fieldset">
    <FormLabel id={formLabelId}>
      <Typography variant="body2" sx={{ color: "black" }}>
        {label}
      </Typography>
    </FormLabel>
    <RadioGroup
      sx={{
        "& .MuiRadio-root": { transform: "scale(0.8)" },
        "& .MuiFormControlLabel-label": { fontSize: "13px" },
      }}
      aria-labelledby={formLabelId}
      {...props}
    >
      {options.map((option) => (
        <StyledFormControlLabel
          key={option.value}
          control={<Radio />}
          label={option.label}
          value={option.value}
        />
      ))}
    </RadioGroup>
  </FormControl>
);

export default StyledRadioGroup;
