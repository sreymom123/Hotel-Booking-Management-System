import crypto from "crypto";

export const generateBookingCode = (): string => {
  return (
    "BK-" +
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
};