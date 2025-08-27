import { io } from "socket.io-client";

class SocketService {
    constructor() {
        this.socket = null;
    }

    getBackendUrl() {
        // Check if we're in development or production
        if (import.meta.env.DEV) {
            return 'http://localhost:8080';
        } else {
            // For production, use your hosted backend URL
            return 'https://photogram-f8if.onrender.com';
        }
    }

    connect(userId) {
        if (this.socket) {
            this.socket.disconnect();
        }

        const backendUrl = this.getBackendUrl();
        console.log('Connecting to backend:', backendUrl);

        this.socket = io(backendUrl, {
            query: {
                userId: userId
            },
            transports: ['websocket']
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }

    isConnected() {
        return this.socket && this.socket.connected;
    }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;
