import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { getLoginUrl } from "./auth";

// Define the user session payload structure
interface UserSessionPayload {
  name: string;
  email: string;
  role: string;
  accessToken: string; // Add accessToken to the payload
  jti: string; // JWT ID
  exp: number; // Expiration time
}

// Environment variables
const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET environment variable is not set");
}
const encodedKey = new TextEncoder().encode(secretKey);

// Encrypt and set the session cookie
export async function createSession(
  payload: Omit<UserSessionPayload, "jti" | "exp">
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set("user_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// Decrypt and retrieve the session
export async function getSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session")?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ["HS256"],
    });
    // Construct and return the session payload, ensuring type safety
    return {
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
      accessToken: payload.accessToken as string, // Add accessToken
      jti: payload.jti as string,
      exp: payload.exp as number,
    };
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

// Delete the session cookie
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
  // Optionally, you might want to clear other auth-related cookies too
  cookieStore.delete("access_token");
  cookieStore.delete("id_token");
  cookieStore.delete("refresh_token");
}

// Refresh the session expiration
export async function updateSession() {
  const session = await getSession();
  if (session) {
    // Re-create the session with the same payload but a new expiration time
    await createSession({
      name: session.name,
      email: session.email,
      role: session.role,
      accessToken: session.accessToken,
    });
  }
}

// Utility to get user session or redirect if not found
export async function getUserOrRedirect(): Promise<UserSessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }
  return session;
}
