import { Box, Divider, Drawer, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "../../UI/context/FormContext";
import ViewOptions from "./ViewOptions";
import { Constants } from "../../../../shared/constants";
import ViewPathForm from "./ViewPathForm";
import StyledInfoSection from "../../UI/StyledInfoSection";

const PC_CHECKBOX_IDENTIFIER_KEY = "projectComponentCheckbox";
const STREAM_SELECTED_KEY = "selectedStream";
const pathSeparator = window.electronApi.pathSeparator();

/**
 * A React functional component that renders the "View Options" drawer for the "Create View" operation.
 */
const ViewOptionDrawer = ({
  isOpen,
  toggleViewOptions,
}: {
  isOpen: boolean;
  toggleViewOptions: () => void;
}) => {
  return (
    <Drawer open={isOpen} anchor="right" onClose={toggleViewOptions}>
      <ViewOptions handleCloseViewOptions={toggleViewOptions} />
    </Drawer>
  );
};

/**
 * A React functional component that renders the view path details form for the "Create View" operation.
 * This component provides fields for entering a view tag, selecting a copy area path,
 * and additional options related to project components.
 *
 * @returns {*}
 */
const ViewPathDetails = () => {
  const { updateFeatureFormData, getFeatureFormData } = useFormContext();
  const formData = getFeatureFormData(Constants.OPERATION_NAMES.CREATE_VIEW);

  const [copyAreaChangedManually, setCopyAreaChangedManually] = useState(false);
  const [viewTag, setViewTag] = useState<string>(formData.viewTag || "");
  const [viewStoragePath, setViewStoragePath] = useState<string>(
    formData.viewStoragePath || ""
  );
  const [isProjectComponentEnabled, setIsProjectComponentEnabled] = useState(
    sessionStorage.getItem(PC_CHECKBOX_IDENTIFIER_KEY) === "true" || false
  );
  const [isViewOptionsOpen, setIsViewOptionsOpen] = useState(false);
  const [userHomeDirectory, setUserHomeDirectory] = useState<string>("");

  useEffect(() => {
    /**
     * Fetches the user's home directory from the backend.
     *
     * @returns {Promise<string>} - The user's home directory path.
     */
    const fetchUserHomeDirectory = async (): Promise<string> => {
      try {
        const directory = await window.electronApi.userHomeDirectory();
        setUserHomeDirectory(directory);
        return directory;
      } catch (error) {
        console.error("Failed to fetch user home directory", error);
        return "";
      }
    };

    /**
     * Initializes the component by fetching user data and updating paths.
     *
     * @returns {*}
     */
    const initialize = async () => {
      const userHome = await fetchUserHomeDirectory();
      const curStreamSelected = formData.streamSelector;
      const prevSelectedStream =
        sessionStorage.getItem(STREAM_SELECTED_KEY) || "";
      if (
        curStreamSelected &&
        (!prevSelectedStream || curStreamSelected !== prevSelectedStream)
      ) {
        sessionStorage.setItem(STREAM_SELECTED_KEY, curStreamSelected);
        if (curStreamSelected.includes("@")) {
          const streamArr = curStreamSelected.split("@");
          const defaultViewName = streamArr[0].replace("stream:", "");
          setViewTag(defaultViewName);
          const defaultPath = `${userHome}${pathSeparator}${defaultViewName}`;
          setViewStoragePath(defaultPath);
          updateFeatureFormData(
            Constants.OPERATION_NAMES.CREATE_VIEW,
            "viewTag",
            defaultViewName
          );
          updateFeatureFormData(
            Constants.OPERATION_NAMES.CREATE_VIEW,
            "viewStoragePath",
            defaultPath
          );
        }
      }
    };

    initialize();
  }, [formData.streamSelector]);

  /**
   * Handles changes to the view tag input field.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   */
  const handleViewTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newViewTag = event.target.value;
    setViewTag(newViewTag);
    if (!copyAreaChangedManually) {
      const updatedPath = viewStoragePath
        ? `${viewStoragePath
            .split(pathSeparator)
            .slice(0, -1)
            .join(pathSeparator)}${pathSeparator}${newViewTag}`
        : `${userHomeDirectory}${pathSeparator}${newViewTag}`;
      setViewStoragePath(updatedPath);
      updateFeatureFormData(
        Constants.OPERATION_NAMES.CREATE_VIEW,
        "viewStoragePath",
        updatedPath
      );
    }
    updateFeatureFormData(
      Constants.OPERATION_NAMES.CREATE_VIEW,
      "viewTag",
      newViewTag
    );
  };

  /**
   * Handles changes to the copy area path input field.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   */
  const handleCopyAreaPathChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedPath = event.target.value;
    setViewStoragePath(updatedPath);
    setCopyAreaChangedManually(true);
    updateFeatureFormData(
      Constants.OPERATION_NAMES.CREATE_VIEW,
      "viewStoragePath",
      updatedPath
    );
  };

  /**
   * Opens the file browser dialog and selects the directory path
   *
   * @async
   * @returns {*}
   */
  const handleBrowseButton = async () => {
    const selectedPath: string = await window.electronApi.browseDirectoryPath();
    if (selectedPath) {
      const updatedPath = viewTag
        ? `${selectedPath}${pathSeparator}${viewTag}`
        : selectedPath;
      setViewStoragePath(updatedPath);
      updateFeatureFormData(
        Constants.OPERATION_NAMES.CREATE_VIEW,
        "viewStoragePath",
        updatedPath
      );
    }
  };

  /**
   * Toggles the "View Options" drawer.
   */
  const toggleViewOptions = () => {
    setIsViewOptionsOpen((prev) => !prev);
  };

  /**
   * Handles the change event for the "Project Component" checkbox.
   *
   * @param {React.SyntheticEvent<Element, Event>} event - The change event from the checkbox.
   * @param {boolean} checked - The new checkbox state.
   */
  const handleProjectComponentChange = (
    event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    sessionStorage.setItem(PC_CHECKBOX_IDENTIFIER_KEY, checked.toString());
    setIsProjectComponentEnabled(checked);
  };

  return (
    <Box>
      <Box p={2} height={"22px"}>
        <Typography variant="subtitle1" fontWeight={"bold"} gutterBottom>
          Create a UCM development view
        </Typography>
      </Box>
      <Divider />
      <StyledInfoSection
        information={`For stream: ${formData.streamSelector}. Specify a tag and copy area path name for
       this ${formData.viewType} view.`}
      />
      <ViewPathForm
        viewTag={viewTag}
        handleViewTagChange={handleViewTagChange}
        toggleViewOptions={toggleViewOptions}
        viewStoragePath={viewStoragePath}
        handleCopyAreaPathChange={handleCopyAreaPathChange}
        handleBrowseButton={handleBrowseButton}
        isProjectComponentEnabled={isProjectComponentEnabled}
        handleProjectComponentChange={handleProjectComponentChange}
      />
      <ViewOptionDrawer
        isOpen={isViewOptionsOpen}
        toggleViewOptions={toggleViewOptions}
      />
    </Box>
  );
};

export default ViewPathDetails;
