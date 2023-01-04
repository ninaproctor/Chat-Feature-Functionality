import logo from "./logo.svg";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";


function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("message-from-server", (data) => {
      // setChat([...chat, data.message])
      setChat((prev) => [...prev, data.message]);
      // console.log("message recieved", data);
    });
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    console.log(message);
    socket.emit("send-message", { message });
    setMessage("");
  }

  return (
    <div>
      <Container>
        <Box sx={{marginBottom:5}}>
          {chat.map((message) => (
            <Typography key={message}>{message}</Typography>
          ))}
        </Box>
        <Box component="form" onSubmit={handleForm}>
          <TextField
            size="small"
            id="standard-basic"
            label="Send a message"
            variant="standard"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button varient="text" type="submit">
            Send
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default App;
