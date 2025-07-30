import { getUserOrRedirect } from "@/lib/session";
import { ProfileClient } from "./profile-client";

// This is the main server component for the profile page.
// It fetches all necessary data on the server and passes it to a client component.

interface UserProfile {
  displayName?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  emails?: Array<{ value: string; type?: string }>;
  phoneNumbers?: Array<{ value: string; type?: string }>;
  addresses?: Array<{
    formatted?: string;
    streetAddress?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    type?: string;
  }>;
  meta?: {
    created?: string;
  };
  "urn:ietf:params:scim:schemas:extension:ibm:2.0:User"?: {
    twoFactorAuthentication?: boolean;
  };
}

async function getFullUserProfile(
  accessToken: string | undefined
): Promise<UserProfile | null> {
  if (!accessToken) {
    return null;
  }

  const tenantUrl = process.env.tenantUrl;
  if (!tenantUrl) {
    console.error("Tenant URL is not configured.");
    return null;
  }

  try {
    const response = await fetch(`${tenantUrl}/v2.0/Me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch full user profile:", errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching full user profile:", error);
    return null;
  }
}

export default async function ProfilePage() {
  // 1. Get the user session, which now includes the access token
  const user = await getUserOrRedirect();

  // 2. Fetch the full, detailed user profile using the token from the session
  const userProfile = await getFullUserProfile(user.accessToken);

  // 3. Pass all data to the client component for rendering and interaction
  return <ProfileClient user={user} profile={userProfile} />;
}
