import os from 'os';
import diskusage from 'diskusage';

// Convert bytes to GB
const bytesToGB = (bytes) => (bytes / 1024 / 1024 / 1024).toFixed(2);

// Calculate CPU usage between two snapshots
const getCpuUsage = (prevCpuTimes) => {
  const cpus = os.cpus();

  let idleTime = 0;
  let totalTime = 0;

  cpus.forEach((cpu, index) => {
    const { user, nice, sys, idle, irq } = cpu.times;

    const prevIdle = prevCpuTimes[index].idle;
    const prevTotal = prevCpuTimes[index].total;

    const currentTotal = user + nice + sys + idle + irq;
    const currentIdle = idle;

    const totalDiff = currentTotal - prevTotal;
    const idleDiff = currentIdle - prevIdle;

    idleTime += idleDiff;
    totalTime += totalDiff;
  });

  return ((1 - idleTime / totalTime) * 100).toFixed(2); // Return as a percentage
};

// Helper function to take a snapshot of current CPU times
const getCpuSnapshot = () => {
  return os.cpus().map((cpu) => {
    const { user, nice, sys, idle, irq } = cpu.times;
    return {
      idle,
      total: user + nice + sys + idle + irq,
    };
  });
};

// API route to return memory, CPU, and disk usage
export default async function handler(req, res) {
  // Memory stats
  const totalMem = os.totalmem(); // Total memory in bytes
  const freeMem = os.freemem(); // Free memory in bytes
  const usedMem = totalMem - freeMem; // Used memory in bytes
  const memoryUsage = ((usedMem / totalMem) * 100).toFixed(2); // Memory usage percentage
  const totalMemGB = bytesToGB(totalMem); // Total memory in GB
  const usedMemGB = bytesToGB(usedMem); // Used memory in GB

  // CPU stats
  const prevCpuSnapshot = getCpuSnapshot(); // Initial snapshot of CPU times
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
  const cpuUsage = getCpuUsage(prevCpuSnapshot); // Calculate CPU usage based on interval

  // Disk usage (for the root directory '/')
  let diskStats;
  try {
    diskStats = diskusage.checkSync('/');
  } catch (err) {
    console.error('Failed to get disk usage:', err);
    return res.status(500).json({ error: 'Failed to get disk usage' });
  }

  const totalDiskGB = bytesToGB(diskStats.total); // Total disk space in GB
  const freeDiskGB = bytesToGB(diskStats.free); // Free disk space in GB
  const usedDiskGB = bytesToGB(diskStats.total - diskStats.free); // Used disk space in GB
  const diskUsage = ((usedDiskGB / totalDiskGB) * 100).toFixed(2); // Disk usage percentage

  // Return the system stats
  res.status(200).json({
    memoryUsage: parseFloat(memoryUsage),
    totalMemGB: parseFloat(totalMemGB),
    usedMemGB: parseFloat(usedMemGB),
    cpuUsage: parseFloat(cpuUsage),
    diskUsage: parseFloat(diskUsage),
    totalDiskGB: parseFloat(totalDiskGB),
    usedDiskGB: parseFloat(usedDiskGB),
  });
}
