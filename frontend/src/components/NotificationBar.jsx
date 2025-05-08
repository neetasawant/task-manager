'use client';
import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

export default function NotificationBar() {
  const socket = useSocket();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!socket) return;
  console.log(socket)
    socket.on('connect', () => {
      console.log('Connected to Socket:', socket.id); 
    });
  
    socket.on('notification', (data) => {
      console.log('Notification received:', data); 
      if (data.message) {
        setMessage(data.message);
      }
    });
  
    return () => {
      socket.off('notification');
    };
  }, [socket]);
  

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow z-50">
      {message}
    </div>
  );
}
