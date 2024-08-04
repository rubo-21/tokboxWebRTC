import {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import "./App.css";

import Home from "./components/Home";
import VideoCall from "./components/VideoCall";

import Container from "@mui/material/Container";

import OT from "@opentok/client";
import { isDesktop, isIOS, isAndroid, browserName } from "react-device-detect";

function App() {
  const [showVideoPage, setShowVideoPage] = useState(false);
  const [deviceType, setDeviceType] = useState("");
  const [camera, setCamera] = useState("");
  const [microphone, setMicrophone] = useState("");
  const [cameraDevices, setCameraDevices] = useState([]);
  const [microphoneDevices, setMicrophoneDevices] = useState([]);
  const [startInit, setStartInit] = useState(false);
  const [session, setSession] = useState(null);
  const [subscriber, setSubscriber] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const subscriberRef = useRef(null);

  const getDeviceType = useCallback(() => {
    if (isDesktop) {
      setDeviceType("Desktop");
    } else if (isAndroid) {
      setDeviceType("Android");
    } else if (isIOS) {
      setDeviceType("iOS");
    }
  }, []);

  useEffect(() => {
    getDeviceType();
  }, [getDeviceType]);

  const populateDeviceSources = (kind, state) => {
    OT.getDevices((err, devices) => {
      if (err) {
        console.error("getDevices error " + err.message);
        return;
      }
      for (const device of devices) {
        if (device.kind === kind) {
          state((prev) => [...prev, device]);
        }
      }
    });
  };

  useEffect(() => {
    // We request access to Microphones and Cameras so we can get the labels
    OT.getUserMedia().then(() => {
      populateDeviceSources("audioInput", setMicrophoneDevices);
      populateDeviceSources("videoInput", setCameraDevices);
    });
  }, []);

  const initializeSession = useCallback(() => {
    // connect to session
    const session = OT.initSession(
      import.meta.env.VITE_TOKBOX_API_ID,
      import.meta.env.VITE_TOKBOX_SESSION_ID
    );
    setSession(session);

    // create publisher
    const publisherOptions = {
      insertMode: "append",
      width: "100%",
      height: "100%",
      audioSource: microphone,
      videoSource: camera,
    };
    const publisher = OT.initPublisher("publisher", publisherOptions);
    setPublisher(publisher);

    session.connect(import.meta.env.VITE_TOKBOX_TOKEN, function (err) {
      if (err) {
        console.log(err);
      } else {
        // publish publisher
        session.publish(publisher);
      }
    });

    // create subscriber
    session.on("streamCreated", function (event) {
      const subscriberOptions = {
        insertMode: "append",
        width: "100%",
        height: "100%",
      };
      const subscriber = session.subscribe(
        event.stream,
        "subscriber",
        subscriberOptions
      );
      setSubscriber(subscriber);
    });

    session.on("sessionDisconnected", (event) => {
      console.log("You were disconnected from the session.", event.reason);
    });
  }, [camera, microphone]);

  const disconnectSession = useCallback(() => {
    if (!session) {
      return;
    }
    session.off("streamCreated");
    session.off("sessionDisconnected");
    session.disconnect();
    if (subscriber) {
      session.unsubscribe(subscriber.id);
      if (subscriberRef.current) {
        // clear subscriber element
        subscriberRef.current.innerHTML = "";
      }
      // clear publisher only when there is a subscriber
      if (publisher) {
        publisher.destroy();
        session.unpublish(publisher);
      }
    }
    setStartInit(false);
    console.log("Session disconnected");
  }, [publisher, session, subscriber]);

  const handleJoinClick = useCallback(() => {
    if (camera && microphone) {
      setShowVideoPage(true);
      setStartInit(true);
    }
  }, [camera, microphone]);

  useLayoutEffect(() => {
    if (startInit) {
      initializeSession();
    }
  }, [initializeSession, startInit]);

  const handleLeaveCallClick = useCallback(() => {
    disconnectSession();
    setShowVideoPage(false);
  }, [disconnectSession]);

  return (
    <Container maxWidth="sm">
      {!showVideoPage && (
        <Home
          deviceType={deviceType}
          browserName={browserName}
          onJoin={handleJoinClick}
          camera={camera}
          onCameraChange={(val) => setCamera(val)}
          cameraDevices={cameraDevices}
          microphone={microphone}
          onMicrophoneChange={(val) => setMicrophone(val)}
          microphoneDevices={microphoneDevices}
        />
      )}
      {showVideoPage && (
        <VideoCall onLeaveCall={handleLeaveCallClick} ref={subscriberRef} />
      )}
    </Container>
  );
}

export default App;
