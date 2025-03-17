import { Box, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useFormContext } from "../../UI/context/FormContext";
import { Constants } from "../../../../shared/constants";
import StyledRadioGroup from "../../UI/StyledRadioGroup";
import StyledCheckbox from "../../UI/StyledCheckbox";

const CHECKBOX_STORAGE_KEY = "checkBoxSettingaKey";
const DEFAULT_CHECKBOX_SETTINGS = {
  createUCM: false,
  autoHijack: false,
  nativeSymlinks: false,
};
/**
 * A React functional component that renders the view type details form for the "Create View" operation.
 * It provides options to select a view type and toggle additional settings through checkboxes.
 * @returns {*}
 */
const ViewTypeDetails = () => {
  const { updateFeatureFormData, getFeatureFormData } = useFormContext();
  const formData = getFeatureFormData(Constants.OPERATION_NAMES.CREATE_VIEW);
  console.log("viewtype in viewtypedetails:", formData.viewType);

  const [viewType, setViewType] = useState(formData.viewType || "web");
  /**
   * State to manage the checkbox settings with persistence.
   */
  const [checkBoxSettings, setCheckBoxSettings] = useState(() => {
    try {
      const savedSettings = sessionStorage.getItem(CHECKBOX_STORAGE_KEY);
      return savedSettings
        ? JSON.parse(savedSettings)
        : DEFAULT_CHECKBOX_SETTINGS;
    } catch (error) {
      console.error("Failed to parse sessionStorage data", error);
      return DEFAULT_CHECKBOX_SETTINGS;
    }
  });

  /**
   * Handles the change event for the view type radio buttons.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object from the radio button change.
   */
  const handleViewTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedViewType = event.target.value;
    console.log("viewtype in viewtypechangehandler:", selectedViewType);
    updateFeatureFormData(
      Constants.OPERATION_NAMES.CREATE_VIEW,
      "viewType",
      selectedViewType
    );
    setViewType(selectedViewType);
  };

  /**
   * Handles the change event for a specific checkbox setting.
   *
   * @param {keyof typeof checkBoxSettings} key - The key of the checkbox setting to update.
   * @returns {(event: React.ChangeEvent<HTMLInputElement>) => void} A change event handler for the checkbox.
   */
  const handleCheckboxChange =
    (key: keyof typeof checkBoxSettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedSettings = {
        ...checkBoxSettings,
        [key]: event.target.checked,
      };
      setCheckBoxSettings(updatedSettings);
      sessionStorage.setItem(
        CHECKBOX_STORAGE_KEY,
        JSON.stringify(updatedSettings)
      );
    };

  return (
    <Box>
      <Box p={2} height={"22px"}>
        <Typography variant="subtitle1" fontWeight={"bold"} gutterBottom>
          Specify a view type.
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <StyledRadioGroup
          name="view-type-group"
          formLabelId="view-type-group-label"
          label="What type of view would you like to create?"
          options={[
            { label: "Web", value: "web" },
            { label: "Automatic", value: "automatic" },
            { label: "Dynamic", value: "dynamic" },
            { label: "Snapshot", value: "snapshot" },
          ]}
          value={viewType}
          onChange={handleViewTypeChange}
        />
      </Box>
      <Divider />
      <Box p={2} sx={{ display: "flex", flexDirection: "column" }}>
        <StyledCheckbox
          label="Create a view on an existing UCM stream"
          checked={checkBoxSettings.createUCM}
          onChange={handleCheckboxChange("createUCM")}
        />
        <StyledCheckbox
          label="Auto hijack mode"
          checked={checkBoxSettings.autoHijack}
          onChange={handleCheckboxChange("autoHijack")}
        />
        <StyledCheckbox
          label="Enable native symbolic links"
          checked={checkBoxSettings.nativeSymlinks}
          onChange={handleCheckboxChange("nativeSymlinks")}
        />
      </Box>
    </Box>
  );
};

export default ViewTypeDetails;
