import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

/**
 * Props for the `AppNotification` component.
 */
interface AppNotificationProps {
  /**
   * Determines if the notification is visible.
   */
  open: boolean;

  /**
   * The message to be displayed in the notification.
   */
  message: string;

  /**
   * Type of notification; determines the color scheme.
   * Can be "error", "success", "info", or "warning".
   */
  severity?: AlertColor;

  /**
   * Callback function triggered when the notification is closed.
   */
  onClose: () => void;

  /**
   * Duration in milliseconds for automatically hiding the notification.
   * Defaults to 60 seconds.
   */
  autoHideDuration?: number;
}

/**
 * `AppNotification` is a reusable component for displaying notifications.
 * It uses Material-UI's `Snackbar` and `Alert` for styling and functionality.
 *
 * @param {AppNotificationProps} props - The props for the component.
 * @returns {JSX.Element} The notification component.
 *
 * @example
 * <AppNotification
 *   open={true}
 *   message="Operation successful!"
 *   severity="success"
 *   onClose={() => console.log("Notification closed")}
 * />
 */
const AppNotification = (props: AppNotificationProps) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={props.autoHideDuration ? props.autoHideDuration : 60000}
      onClose={props.onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={props.onClose}
        severity={props.severity ? props.severity : "info"}
        sx={{ width: "100%" }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default AppNotification;
