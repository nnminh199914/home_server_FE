import { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Container, CssBaseline, TextField, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Dark theme similar to the login page
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
    },
  },
});

const MainPage = () => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [usedMemGB, setUsedMemGB] = useState(0);
  const [totalMemGB, setTotalMemGB] = useState(0);
  const [diskUsage, setDiskUsage] = useState(0);
  const [usedDiskGB, setUsedDiskGB] = useState(0);
  const [totalDiskGB, setTotalDiskGB] = useState(0);
  const [apiResponse, setApiResponse] = useState(''); // Holds API response
  const [inputValue, setInputValue] = useState(''); // Holds input value for API

  // Function to fetch actual system stats from the API
  const fetchSystemStats = async () => {
    const response = await fetch('/api/system-stats');
    const data = await response.json();
    setCpuUsage(data.cpuUsage);
    setMemoryUsage(data.memoryUsage);
    setUsedMemGB(data.usedMemGB);
    setTotalMemGB(data.totalMemGB);
    setDiskUsage(data.diskUsage);
    setUsedDiskGB(data.usedDiskGB);
    setTotalDiskGB(data.totalDiskGB);
  };

  // Function to handle custom API CRUD call
  const handleApiCall = async () => {
    try {
      const response = await fetch('https://freetestapi.com/api/v1/airlines', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        //body: JSON.stringify({ input: inputValue }), // Send input value in the body
      });

      const data = await response.json();
      setApiResponse(JSON.stringify(data)); // Display response in TextField
    } catch (error) {
      setApiResponse('Error occurred while calling API');
    }
  };

  // Fetch the stats on component mount and every 5 seconds
  useEffect(() => {
    fetchSystemStats(); // Fetch initially
    const interval = setInterval(fetchSystemStats, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* First Container for System Stats */}
      <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: 'background.paper', p: 2, borderRadius: 2 }}>
        {/* Header for System Stats */}
        <Typography variant="h5" color="text.primary" gutterBottom>
          System Stats
        </Typography>

        {/* Flexbox layout for system stats */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          {/* CPU Usage */}
          <Box flex={1} textAlign="center" mx={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              CPU Usage
            </Typography>
            <LinearProgress variant="determinate" value={cpuUsage} sx={{ height: 10, borderRadius: 5 }} />
            <Typography color="text.primary" mt={1}>{cpuUsage}%</Typography>
          </Box>

          {/* Memory Usage */}
          <Box flex={1} textAlign="center" mx={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Memory Usage
            </Typography>
            <LinearProgress variant="determinate" value={memoryUsage} sx={{ height: 10, borderRadius: 5 }} />
            <Typography color="text.primary" mt={1}>
              {memoryUsage}% ({usedMemGB} GB / {totalMemGB} GB)
            </Typography>
          </Box>

          {/* Disk Usage */}
          <Box flex={1} textAlign="center" mx={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Disk Usage
            </Typography>
            <LinearProgress variant="determinate" value={diskUsage} sx={{ height: 10, borderRadius: 5 }} />
            <Typography color="text.primary" mt={1}>
              {diskUsage}% ({usedDiskGB} GB / {totalDiskGB} GB)
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Second Container for API Call */}
      <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: 'background.paper', p: 2, borderRadius: 2 }}>
        {/* Header for API Call Section */}
        <Typography variant="h5" color="text.primary" gutterBottom>
          Custom API Call
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
          <TextField
            label="Input for API"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ flex: 1, mr: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleApiCall}>
            Call API
          </Button>
        </Box>

        {/* TextField to show API response */}
        <TextField
            label="API Response"
            variant="outlined"
            value={apiResponse}
            fullWidth
            multiline
            disabled
            sx={{
                mt: 2,
                maxHeight: 220, // Set the max height for the TextField
                overflow: 'auto', // Enable scrolling when content overflows
            }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default MainPage;
