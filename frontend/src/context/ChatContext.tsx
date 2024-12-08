import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import io from 'socket.io-client';
import { Message, ChatContextType} from '../types/chat';

const SOCKET_URL = 'http://localhost:8080';
const MESSAGES_QRY_KEY = ['messages'];

const socket = io(SOCKET_URL);

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>('Anon');
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: MESSAGES_QRY_KEY,
    queryFn: () => {
      if (isSocketConnected) {
        return new Promise((resolve) => {
          socket.once('messages', (initialMessages: Message[]) => {
            resolve(initialMessages);
          });
        });
      } else {
        return fetch(`${SOCKET_URL}/messages`)
          .then(res => {
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            console.log('fetching messages through REST', res);
            return res.json();
          });
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => {
      return new Promise<Message>((resolve) => {
        const newMessage = { 
          name, 
          message: message.trim(), 
        };
        socket.emit('sendMessage', newMessage);
        resolve(newMessage as Message);
      });
    },

    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: MESSAGES_QRY_KEY });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<Message[]>(MESSAGES_QRY_KEY);

      // Optimistically update to the new value
      queryClient.setQueryData<Message[]>(MESSAGES_QRY_KEY, (oldMessages = []) => [
        ...oldMessages,
        { name, message: newMessage },
      ]);

      return { previousMessages };
    },

    onError: (err, newMessage, context) => {
      // Roll back to the previous value
      if (context?.previousMessages) {
        queryClient.setQueryData<Message[]>(MESSAGES_QRY_KEY, context.previousMessages);
      }
    },
  });

  useEffect(() => {
    socket.on('connect', () => {
      setIsSocketConnected(true);
    });
    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    socket.on('newMessage', (message: Message) => {
      /* 
        Ideally you want to check by user id or something unique instead of name here to avoid duplicate sent messages showing up. 
        We're already optimistically updating the UI so this prevents it.
      */
      if (message.name !== name) {
        queryClient.setQueryData<Message[]>(MESSAGES_QRY_KEY, (oldMessages = []) => [
          ...oldMessages,
          message,
        ]);
      }
    });

    socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.off('newMessage');
      socket.off('error');
    };
  }, [queryClient, name]);

  const sendMessage = (message: string) => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        name,
        setName,
        sendMessage,
        isLoading: sendMessageMutation.isPending,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatProvider;