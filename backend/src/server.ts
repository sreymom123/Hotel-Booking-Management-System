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
  const server = app.listen(config.port);

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(`❌ Port ${config.port} is already in use. Please stop the process using port ${config.port} or choose a different PORT in your .env file.`);
      process.exit(1);
    }

    console.error("❌ Server failed to start:", error);
    process.exit(1);
  });

  server.on("listening", () => {
    console.log(`=======================================================`);
    console.log(`🏨 Hotel Booking Management API running in [${config.nodeEnv}] mode.`);
    console.log(`🔗 Main Endpoint: ${baseUrl}`);
    console.log(`📡 HTTP Methods:`);
    console.log(`   POST   ${baseUrl}                   → Create/Checkin`);
    console.log(`   POST   ${baseUrl}/checkout          → Checkout`);
    console.log(`   GET    ${baseUrl}                   → Get All`);
    console.log(`   GET    ${baseUrl}/:id               → Get One`);
    console.log(`   PUT    ${baseUrl}/:id               → Update`);
    console.log(`   DELETE ${baseUrl}/:id               → Delete`);
    console.log(
      isDatabaseConnected
        ? "🟢 MySQL Status: CONNECTED ✓ Database operational and ready for queries"
        : `🔴 MySQL Status: OFFLINE ✗ Error: ${connectionError}`
    );
    console.log(`=======================================================`);
  });
};

void startServer();
