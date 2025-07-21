import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../../src/store/authStore';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:3001');

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join', { userId: user.id });
      });

      newSocket.on('orderUpdate', (data) => {
        toast.success(data.message);
      });

      newSocket.on('adminNotification', (data) => {
        if (user.role === 'admin') {
          toast.success(data.message);
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;