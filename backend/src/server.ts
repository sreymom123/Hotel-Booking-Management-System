import app from "./app";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(
    `Hotel Booking Management API running on port ${config.port} in ${config.nodeEnv} mode.`,
  );
});
