import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

export const config = {
  port: parsePort(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
};
