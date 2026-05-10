import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        path: "/socket.io",
        transports: ["websocket"],
        upgrade: false
      });

      this.socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });
    }
    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
