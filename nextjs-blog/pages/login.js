import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { validateToken, generateToken } from '../helper/helper';
import { TextField, Button, Box, Typography, Container, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a custom dark theme with greyish colors
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Lighter blue
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e',  // Paper elements background
    },
    text: {
      primary: '#e0e0e0', // Light grey text
    },
    error: {
      main: '#f44336', // Red for error messages
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e', // Greyish background for inputs
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242', // Grey button background
          '&:hover': {
            backgroundColor: '#616161', // Slightly lighter on hover
          },
        },
      },
    },
  },
});

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token && (await validateToken(token))) {
        router.push('/'); // Redirect to the home page if the token is valid
      }
    };
    checkToken();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hardcodedUsername = 'admin';
    const hardcodedPassword = 'password123';

    if (username === hardcodedUsername && password === hardcodedPassword) {
      // Generate a token with expiration
      const expiration = new Date().getTime() + 60 * 1000; // 1 hour expiry
      const token = await generateToken(username, expiration);

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Redirect to the homepage
      router.push('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xs" sx={{ mt: 8, backgroundColor: 'background.paper', p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="text.primary">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ backgroundColor: 'background.default', borderRadius: 1 }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ backgroundColor: 'background.default', borderRadius: 1 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
          </Box>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
