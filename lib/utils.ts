import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function handleLogout() {
  try {
    const response = await fetch("/api/logout", { method: "POST" });
    const logoutUrl = await response.json();
    if (logoutUrl) {
      console.log("in if", logoutUrl);
      window.location.href = logoutUrl.url;
    }
  } catch (error) {
    console.error("Failed to clear server-side session:", error);
  }
}
