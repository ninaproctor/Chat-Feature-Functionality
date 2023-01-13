import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function ChatWindow() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("message-from-server", (data) => {
      setChat((prev) => [...prev, { message: data.message, received: true }]);
    });

    socket.on("typing-started-from-server", () => setTyping(true));
    socket.on("typing-stoped-from-server", () => setTyping(false));
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    console.log(message);
    socket.emit("send-message", { message });
    setChat((prev) => [...prev, { message, received: false }]);
    setMessage("");
  }

  const [typingTimeout, settypingTimeout] = useState(null);

  function handleInput(e) {
    setMessage(e.target.value);
    socket.emit("typing-started");
    if (typingTimeout) clearTimeout(typingTimeout);
    settypingTimeout(
      setTimeout(() => {
        socket.emit("typing-stoped");
      }, 1000)
    );
  }

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            padding: 2,
            mariginTop: 10,
            width: "60%",
            backgroundColor: "#ff4c68",
            color: "#ffffff;",
            height: "50%",
            
          }}
        >
          <Box sx={{ marginBottom: 5 }}>
            {chat.map((data) => (
              <Typography
                sx={{
                  textAlign: data.received ? "left" : "right",
                }}
                key={data.message}
              >
                {data.message}
              </Typography>
            ))}
          </Box>
          <Box class="message-box" component="form" onSubmit={handleForm}>
            {typing && (
              <InputLabel
                sx={{ color: "black" }}
                shrink
                htmlFor="message-input"
              >
                Typing....
              </InputLabel>
            )}

            <OutlinedInput
              sx={{
                color: "black",
                backgroundColor: "white",
              }}
              label=" Write your message"
              fullWidth
              size="small"
              id="message-input"
              value={message}
              placeholder="Write your message"
              inputProps={{ "aria-label": "Search google maps" }}
              onChange={handleInput}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: "black" }}
                    type="submit"
                    aria-label="toggle password visibility"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
              // label="Password"
            />
          </Box>
        </Card>
      </Box>
    </div>
  );
}
