import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import PropTypes from "prop-types";

const Home = ({
  deviceType,
  browserName,
  onJoin,
  camera,
  onCameraChange,
  cameraDevices,
  microphone,
  onMicrophoneChange,
  microphoneDevices,
}) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h6" component="h6" sx={{ mb: 2 }}>
          You are joining from {deviceType} device and using {browserName}{" "}
          browser.
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="camera-select-label">Select Camera</InputLabel>
          <Select
            labelId="camera-select-label"
            id="camera-select"
            value={camera}
            label="Camera"
            onChange={(e) => onCameraChange(e.target.value)}
          >
            {cameraDevices &&
              cameraDevices.map((device, index) => (
                <MenuItem value={device.deviceId} key={device.deviceId}>
                  {device.label ? device.label : device.kind + index}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Divider sx={{ mb: 2 }} />
        <FormControl fullWidth>
          <InputLabel id="microphone-select-label">
            Select Microphone
          </InputLabel>
          <Select
            labelId="microphone-select-label"
            id="microphone-select"
            value={microphone}
            label="Microphone"
            onChange={(e) => onMicrophoneChange(e.target.value)}
          >
            {microphoneDevices &&
              microphoneDevices.map((device, index) => (
                <MenuItem value={device.deviceId} key={device.deviceId}>
                  {device.label ? device.label : device.kind + index}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Divider sx={{ mb: 2 }} />
        <Button
          variant="contained"
          onClick={onJoin}
          disabled={!camera || !microphone}
        >
          Join
        </Button>
      </Box>
    </Container>
  );
};

Home.propTypes = {
  deviceType: PropTypes.string.isRequired,
  browserName: PropTypes.string.isRequired,
  onJoin: PropTypes.func.isRequired,
  camera: PropTypes.string.isRequired,
  onCameraChange: PropTypes.func.isRequired,
  cameraDevices: PropTypes.array.isRequired,
  microphone: PropTypes.string.isRequired,
  onMicrophoneChange: PropTypes.func.isRequired,
  microphoneDevices: PropTypes.array.isRequired,
};

export default Home;
