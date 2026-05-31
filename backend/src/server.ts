import app from "./app";
import { config } from "./config/index";
import db from "./config/db"; // Import your live mysql2 connection pool

const startServer = async (): Promise<void> => {
  const baseUrl = `http://localhost:${config.port}`;
  let isDatabaseConnected = false;
  let connectionError: string | null = null;

  try {
    // 1. Test the connection pool immediately on startup by getting a worker thread
    const connection = await db.getConnection();
    isDatabaseConnected = true;
    
    // Release the connection instantly back to the pool pool so it's ready for incoming requests
    connection.release(); 
    console.log("🚀 Database pool handshake verified successfully.");
  } catch (error) {
    connectionError = error instanceof Error ? error.message : "Unknown database connection error.";
    console.warn(`⚠️ Database connection unavailable: ${connectionError}`);
  }

  // 2. Start listening for incoming HTTP Requests
  app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`🏨 Hotel Booking Management API running in [${config.nodeEnv}] mode.`);
    console.log(`🔗 Base URL: ${baseUrl}`);
    console.log(`🏥 Room URL: ${baseUrl}/api`);
    console.log(
      isDatabaseConnected
        ? "🟢 Database Status: CONNECTED (Ready for queries)"
        : `🔴 Database Status: OFFLINE (${connectionError})`
    );
    console.log(`=======================================================`);
  });
};

void startServer();