import { useEffect, useRef } from 'react';
import { Typography, Paper, Box, useTheme } from '@mui/material';
import { useChat } from '../context/ChatContext';

const ChatView: React.FC = () => {
  const { messages, name } = useChat();
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Paper
      elevation={1}
      sx={{
        flex: 1,
        p: 2.5,
        overflowY: 'auto',
        bgcolor: theme.palette.background.paper,
        borderRadius: 1,
        mt: 5,
      }}
    >
      {messages.map((msg, index) => (
        <Box
          key={msg._id || index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.name === name ? 'flex-end' : 'flex-start',
            mb: 2,
          }}
        >
          <Typography
            variant='caption'
            sx={{
              mb: 0.5,
              color: theme.palette.mode === 'light' ? 'text.secondary' : 'text.primary',
            }}
          >
            {msg.name}
          </Typography>
          <Paper
            elevation={0}
            sx={{
              maxWidth: '65%',
              p: '12px 16px',
              bgcolor: msg.name === name
                ? theme.palette.primary.main
                : theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
              color: msg.name === name 
                ? 'primary.contrastText' 
                : 'text.primary',
              borderRadius: 1.5,
              wordBreak: 'break-word',
            }}
          >
            <Typography variant='body1'>
              {msg.message}
            </Typography>
          </Paper>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Paper>
  );
};

export default ChatView;