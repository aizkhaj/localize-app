import { useState } from "react";
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '../context/ChatContext';

const ChatInput: React.FC = () => {
  const { name, setName, sendMessage, isLoading } = useChat();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Box sx={{ display: 'flex', gap: 1.25 }}>
        <TextField 
          multiline
          maxRows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading}
          size="small"
          sx={{
            flex: 1,
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={isLoading}
          endIcon={<SendIcon />}
          sx={{ minWidth: '90px' }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.25 }}>
        <TextField 
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Your name'
          size="small"
          sx={{
            width: '200px',
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatInput;