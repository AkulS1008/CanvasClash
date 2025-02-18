"use client"
import { GameLobby } from '@/components/game-lobby';
import React, {useEffect , useState}from 'react';
// import {io} from "socket.io-client";
// const socket = io("http://localhost:8080");

export default function Home() {
  // const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState<string[]>([]);

  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     setMessages((prev) => [...prev, data]);
  //   });

  //   return () => {
  //     socket.off("receive_message");
  //   };
  // }, []);

  // const sendMessage = () => {
  //   socket.emit("send_message", message);
  //   setMessage("");
  // };

  return (
    // <div>
    //   <h1>Socket.io Chat</h1>
    //   <ul>
    //     {messages.map((msg, index) => (
    //       <li key={index}>{msg}</li>
    //     ))}
    //   </ul>
    //   <input
    //     type="text"
    //     value={message}
    //     onChange={(e) => setMessage(e.target.value)}
    //     placeholder="Type a message"
    //   />
    //   <button onClick={sendMessage}>Send</button>
    // </div>
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Game Lobby</h1>
        <GameLobby />
      </main>
    </div>
  );
}