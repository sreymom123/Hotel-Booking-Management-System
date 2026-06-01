import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the existing process or set a different PORT in backend/.env.`
    );
    process.exit(1);
  }

  throw error;
});
