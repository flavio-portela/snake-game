import { io } from "socket.io-client";

const socket = io("localhost:4000");

socket.on("user connected", (data) => {
  console.log(data);
});
