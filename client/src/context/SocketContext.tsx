"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Initialize the WebSocket connection
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const newSocket = io(backendUrl);

        // Set the socket in state
        setSocket(newSocket);

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected, clearing localStorage");
            localStorage.removeItem("playerId"); // Clear playerId from localStorage
        });

        // Cleanup on unmount
        return () => {
            localStorage.removeItem("playerId");
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};