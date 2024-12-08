import { useState, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline, Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChatProvider from './context/ChatContext';
import ChatView from './components/ChatView';
import ChatInput from './components/ChatInput';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    }
  }
});

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = useMemo(
    () => 
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#0084ff',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#fff' : '#1e1e1e',
          },
          grey: {
            100: mode === 'light' ? '#e4e6eb' : '#2d2d2d',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
                WebkitFontSmoothing: 'auto',
              },
            },
          },
        },
      }), 
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ChatProvider>
          <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100vh' 
            }}
          >
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                py: 1 
              }}
            >
              <IconButton 
                onClick={toggleColorMode} 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0 
                }}
              >
                {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Box>
            <ChatView />
            <ChatInput />
          </Box>
        </ChatProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App
