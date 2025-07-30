export async function generateAccessToken() {
  try {
    const tokenRequest = await fetch("/api/get-access-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (tokenRequest.ok) {
      return { success: true };
    } else {
      const errorData = await tokenRequest.json();
      console.error("Failed to generate access token:", errorData);
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    return { success: false, error };
  }
}

export async function generateOtp(userEmail: string, prefix: number) {
  try {
    const tokenRequest = await fetch("/api/otp-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailAddress: userEmail, correlation: prefix }),
    });
    const data = await tokenRequest.json();
    if (tokenRequest.ok) {
      return data;
    } else {
      console.error("otp request failed", data);
      return data;
    }
  } catch (error) {
    console.error("Error while generating otp:", error);
    return error;
  }
}

export async function verifyOtp(otp: any, otpId: any) {
  try {
    const tokenRequest = await fetch("/api/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: otp, otpId: otpId }),
    });
    if (tokenRequest.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error while verifying otp:", error);
    return error;
  }
}

export async function createUser(body: any) {
  try {
    const tokenRequest = await fetch("/api/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (tokenRequest.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error while creating user:", error);
    return error;
  }
}

export async function getLoginUrl() {
  try {
    const response = await fetch("/api/get-redirect-url");
    if (!response.ok) {
      throw new Error("Failed to get redirect URL");
    }
    const data = await response.json();
    if (data.redirectUrl) {
      return data.redirectUrl;
    } else {
      throw new Error("Redirect URL not found in response");
    }
  } catch (err: any) {
    console.error("Login error:", err);
  }
}

export async function generateSmsOTP(phoneNumber: string, prefix: number) {
  try {
    const tokenRequest = await fetch("/api/sms-otp-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: phoneNumber, correlation: prefix }),
    });
    const data = await tokenRequest.json();
    if (tokenRequest.ok) {
      return data;
    } else {
      console.error("otp request failed", data);
      return data;
    }
  } catch (error) {
    console.error("Error while generating otp:", error);
    return error;
  }
}

export async function verifySmsOTP(otp: any, otpId: any) {
  try {
    const tokenRequest = await fetch("/api/sms-verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: otp, otpId: otpId }),
    });
    const data = await tokenRequest.json();
    if (tokenRequest.ok) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error while verifying otp:", error);
    return error;
  }
}

export async function getChangePasswordUrl() {
  try {
    const response = await fetch("/api/change-password");
    if (!response.ok) {
      throw new Error("Failed to get redirect URL");
    }
    const data = await response.json();
    if (data) {
      return data;
    } else {
      throw new Error("change pass URL not found in response");
    }
  } catch (err: any) {
    console.error("Login error:", err);
  }
}
