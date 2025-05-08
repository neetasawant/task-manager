'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:5000');
  
    socketInstance.on('connect', () => {
      console.log('Connected to Socket:', socketInstance.id);
    });
  
    socketInstance.on('notification', (data) => {
      console.log('Notification received:', data);
    });
  
    setSocket(socketInstance);
  
    return () => {
      socketInstance.disconnect();
      console.log('Disconnected from WebSocket');
    };
  }, []);
  

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
