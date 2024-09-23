import { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Container, CssBaseline } from '@mui/material';
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

  // Fetch the stats on component mount and every 5 seconds
  useEffect(() => {
    fetchSystemStats(); // Fetch initially
    const interval = setInterval(fetchSystemStats, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 8, backgroundColor: 'background.paper', p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="text.primary">
          System Stats
        </Typography>
        <Box mt={4}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            CPU Usage
          </Typography>
          <LinearProgress variant="determinate" value={cpuUsage} sx={{ height: 10, borderRadius: 5, backgroundColor: 'background.default' }} />
          <Typography color="text.primary" mt={1}>{cpuUsage}%</Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Memory Usage
          </Typography>
          <LinearProgress variant="determinate" value={memoryUsage} sx={{ height: 10, borderRadius: 5, backgroundColor: 'background.default' }} />
          <Typography color="text.primary" mt={1}>
            {memoryUsage}% ({usedMemGB} GB / {totalMemGB} GB)
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Disk Usage
          </Typography>
          <LinearProgress variant="determinate" value={diskUsage} sx={{ height: 10, borderRadius: 5, backgroundColor: 'background.default' }} />
          <Typography color="text.primary" mt={1}>
            {diskUsage}% ({usedDiskGB} GB / {totalDiskGB} GB)
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default MainPage;
