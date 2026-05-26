export interface AdminSession {
  token: string;
  admin: {
    name: string;
    email: string;
    role: "admin";
  };
}

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@grandhorizon.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
const adminName = process.env.ADMIN_NAME ?? "Hotel Administrator";
const tokenSecret = process.env.ADMIN_TOKEN_SECRET ?? "hotel-booking-admin";

export class AuthService {
  static async login(email: string, password: string): Promise<AdminSession> {
    if (email.trim().toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      throw new Error("Invalid email or password");
    }

    return {
      token: createToken(adminEmail),
      admin: {
        name: adminName,
        email: adminEmail,
        role: "admin",
      },
    };
  }

  static verifyToken(token: string): AdminSession["admin"] | null {
    const decoded = decodeToken(token);

    if (!decoded || decoded.email.toLowerCase() !== adminEmail.toLowerCase()) {
      return null;
    }

    return {
      name: adminName,
      email: adminEmail,
      role: "admin",
    };
  }
}

function createToken(email: string): string {
  const payload = JSON.stringify({ email, secret: tokenSecret });
  return Buffer.from(payload).toString("base64url");
}

function decodeToken(token: string): { email: string; secret: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as {
      email?: unknown;
      secret?: unknown;
    };

    if (payload.secret !== tokenSecret || typeof payload.email !== "string") {
      return null;
    }

    return {
      email: payload.email,
      secret: payload.secret,
    };
  } catch {
    return null;
  }
}
