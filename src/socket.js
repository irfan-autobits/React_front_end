// src/socket.js
import { io } from "socket.io-client";
const API_URL = process.env.REACT_APP_API_URL //|| "http://localhost:5757";
export default io(API_URL, { transports: ["websocket"] });
