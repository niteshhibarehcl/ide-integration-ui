import React from "react";
import { Box, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

/**
 * A React functional component that renders an information section.
 *
 * @param {string} param0.information - The information to display.
 * @returns {*}
 */
const StyledInfoSection = ({ information }: { information: string }) => (
  <Box p={2}>
    <InfoIcon color="info" />
    <Typography variant="body2" gutterBottom>
      {information}
    </Typography>
  </Box>
);

export default StyledInfoSection;
