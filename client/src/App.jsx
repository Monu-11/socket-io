import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(
    () => io("http://localhost:3000", { withCredentials: true }),
    []
  );

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log("receive-message:", data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container maxWidth="sm">
      {/* <Typography variant="h1" component={"div"} gutterBottom>
        Welcome to Socket.io
      </Typography> */}
      <Box sx={{ height: 200 }} />
      <Typography variant="h6" component={"div"} gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          varient="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          value={message}
          label="Message"
          variant="outlined"
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          value={room}
          label="Room"
          variant="outlined"
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component={"div"} gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
