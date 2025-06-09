import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
  alpha
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C4DFF',
      light: '#B47CFF',
      dark: '#3F1DCB',
    },
    secondary: {
      main: '#00E5FF',
      light: '#6EFFFF',
      dark: '#00B2CC',
    },
    background: {
      default: '#0A0A0A',
      paper: alpha('#1A1A1A', 0.8),
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: 'linear-gradient(45deg, #7C4DFF 30%, #00E5FF 90%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.45)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 0 0 2px rgba(124, 77, 255, 0.2)',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Ollama API
      const response = await axios.post<{ message: { content: string } }>('http://localhost:11434/api/chat', {
        model: 'mistral',
        messages: [{ role: 'user', content: input }],
        stream: false
      });

      const aiMessage: Message = {
        text: response.data.message.content,
        isUser: false
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      const errorMessage: Message = {
        text: "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, убедитесь, что Ollama запущена и доступна по адресу http://localhost:11434",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(124, 77, 255, 0.15) 0%, rgba(0, 229, 255, 0.1) 50%, transparent 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 2, position: 'relative' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 2,
              background: 'linear-gradient(45deg, #7C4DFF, #00E5FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(124, 77, 255, 0.3)',
            }}
          >
            Lomonosov.AI
          </Typography>
          
          <Paper 
            elevation={0}
            sx={{ 
              flex: 1, 
              mb: 2, 
              p: 2, 
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  animation: 'fadeIn 0.3s ease-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    background: message.isUser 
                      ? 'linear-gradient(45deg, rgba(124, 77, 255, 0.2), rgba(0, 229, 255, 0.2))'
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{message.text}</Typography>
                </Paper>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'primary.main',
                    filter: 'drop-shadow(0 0 8px rgba(124, 77, 255, 0.5))',
                  }} 
                />
              </Box>
            )}
          </Paper>

          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -20,
                left: 0,
                right: 0,
                height: 20,
                background: 'linear-gradient(to top, rgba(10, 10, 10, 0.8), transparent)',
                pointerEvents: 'none',
              },
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите ваше сообщение..."
              variant="outlined"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              endIcon={<SendIcon />}
              sx={{ 
                minWidth: '100px',
                borderRadius: 3,
              }}
              disabled={isLoading}
            >
              Отправить
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 