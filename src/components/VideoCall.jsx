import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";

import PropTypes from "prop-types";

const VideoCall = ({ onLeaveCall }) => {
  return (
    <Box sx={{ my: 4 }}>
      <Paper sx={{ py: 4 }}>
        <Typography variant="h6" component="h6" sx={{ mb: 2 }}>
          Video Chat Room
        </Typography>
        <Divider sx={{ mt: 2 }} />
        <Box sx={{ display: "flex" }}>
          <Box
            id="publisher"
            sx={{ width: 500, height: 300, m: 2, border: "1px solid #ccc" }}
          ></Box>
          <Box
            id="subscriber"
            sx={{ width: 500, height: 300, m: 2, border: "1px solid #ccc" }}
          ></Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Button variant="contained" color="secondary" onClick={onLeaveCall}>
          Leave Call
        </Button>
      </Paper>
    </Box>
  );
};

VideoCall.propTypes = {
  onLeaveCall: PropTypes.func.isRequired,
};

export default VideoCall;
