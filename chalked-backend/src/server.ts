import { httpServer, PORT } from './app';

// Start the server
httpServer.listen(PORT, () => {
  console.log(`🚀 Chalked Backend Server running on port ${PORT}`);
  console.log(`📊 Market Hours: 8:00 AM - 9:00 PM`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
  console.log(`📈 Professors API: http://localhost:${PORT}/api/professors`);
  console.log(`⚡ WebSocket Server: ws://localhost:${PORT}`);
});