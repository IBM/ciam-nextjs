"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Check,
  Mail,
  Eye,
  EyeOff,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser, getLoginUrl, generateOtp, verifyOtp } from "@/lib/auth";

// Validation schemas
const emailSchema = z.string().email("Please enter a valid email address");
const otpSchema = z
  .string()
  .length(6, "OTP must be 6 digits")
  .regex(/^\d+$/, "OTP must contain only numbers");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpId, setOtpId] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [correlation, setCorrelation] = useState<any>(null);

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  // Form errors
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[a-z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 12.5;

    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmail = () => {
    try {
      emailSchema.parse(formData.email);
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, email: error.errors[0].message }));
      }
      return false;
    }
  };

  const validateOtp = () => {
    try {
      otpSchema.parse(formData.otp);
      setErrors((prev) => ({ ...prev, otp: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, otp: error.errors[0].message }));
      }
      return false;
    }
  };

  const validateName = (name: string, field: "firstName" | "lastName") => {
    try {
      nameSchema.parse(formData[field]);
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
      return false;
    }
  };

  const validatePassword = () => {
    try {
      passwordSchema.parse(formData.password);
      setErrors((prev) => ({ ...prev, password: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, password: error.errors[0].message }));
      }
      return false;
    }
  };

  const validateConfirmPassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    return true;
  };

  const getRandomInt = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const handleLogin = async () => {
    // Reset any previous errors
    const loginUrl = await getLoginUrl();
    if (loginUrl) {
      router.push(loginUrl);
    } else {
      console.error("Login error:", loginUrl);
      setErrors((prev) => ({
        ...prev,
        email:
          "An error occurred while redirecting to login page. Please retry again.",
      }));
    }
  };

  const handleSendOtp = async () => {
    if (!validateEmail()) return;
    setFormData((prev) => ({
      ...prev,
      otp: "",
    }));

    setIsLoading(true);

    let otpPrefix = getRandomInt();
    setCorrelation(() => otpPrefix);
    const otpRequest = await generateOtp(formData.email, otpPrefix);
    if (otpRequest.id) {
      setOtpId(otpRequest.id);
      setOtpSent(true);
      setCountdown(30);
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "An error occurred while sending otp. Please retry again.",
      }));
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;
    setIsLoading(true);

    const verifyOtpResponse = await verifyOtp(formData.otp, otpId);
    if (verifyOtpResponse) {
      console.log("OTP verified successfully.");
      setOtpVerified(true);
      setStep(2);
      setFormData((prev) => ({
        ...prev,
        otp: "",
      }));
    } else {
      alert("Invalid OTP. Please try again.");
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isFirstNameValid = validateName(formData.firstName, "firstName");
    const isLastNameValid = validateName(formData.lastName, "lastName");
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      return;
    }

    setIsLoading(true);

    const data = {
      schemas: [
        "urn:ietf:params:scim:schemas:core:2.0:User",
        "urn:ietf:params:scim:schemas:extension:ibm:2.0:User",
      ],
      userName: formData.email,
      name: {
        familyName: formData.lastName,
        givenName: formData.firstName,
      },
      emails: [
        {
          value: formData.email,
          type: "work",
        },
      ],

      password: formData.password,
      "urn:ietf:params:scim:schemas:extension:ibm:2.0:User": {
        userCategory: "regular",
        customAttributes: [
          {
            name: "role",
            values: ["admin"],
          },
        ],
      },
    };
    const createUserRequest = await createUser(data);
    if (createUserRequest) {
      console.log("registration done");
      handleLogin();
    } else {
      alert("failed to register user");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex min-h-screen items-center justify-center py-12">
        <div className="mx-auto w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-blue-600" />
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent"
            >
              VeriInsure
            </Link>
          </div>
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Create your account
            </h1>
            <p className="text-slate-600">
              Join VeriInsure to manage your insurance policies with ease
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={validateEmail}
                    disabled={otpSent}
                    className={`pl-9 border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="otp" className="text-slate-700">
                      Verification Code
                    </Label>
                    {countdown > 0 ? (
                      <span className="text-sm text-slate-500">
                        Resend in {countdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {correlation !== 0 ? (
                      <div style={{ width: "100px", letterSpacing: "2px" }}>
                        {correlation} -{" "}
                      </div>
                    ) : null}
                    <Input
                      id="otp"
                      name="otp"
                      placeholder="Enter 6-digit code"
                      value={formData.otp}
                      onChange={handleInputChange}
                      maxLength={6}
                      className={`border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                        errors.otp ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.otp && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.otp}
                    </p>
                  )}
                  <p className="text-sm text-slate-500">
                    We've sent a verification code to{" "}
                    <span className="font-medium">{formData.email}</span>
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOtpSent(false);
                      setCountdown(0);
                    }}
                    className="mt-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Back to Email
                  </Button>
                </div>
              )}

              <div className="pt-2">
                {!otpSent ? (
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading || !formData.email}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                  >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={
                      isLoading || !formData.otp || formData.otp.length !== 6
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={() =>
                        validateName(formData.firstName, "firstName")
                      }
                      className={`pl-9 border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={() => validateName(formData.lastName, "lastName")}
                      className={`pl-9 border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={validatePassword}
                    className={`pl-9 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.password}
                  </p>
                )}

                {formData.password && (
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">
                        Password strength
                      </span>
                      <span className="text-xs font-medium">
                        {passwordStrength < 25
                          ? "Weak"
                          : passwordStrength < 50
                          ? "Fair"
                          : passwordStrength < 75
                          ? "Good"
                          : "Strong"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrength < 25
                            ? "bg-red-500"
                            : passwordStrength < 50
                            ? "bg-amber-500"
                            : passwordStrength < 75
                            ? "bg-green-500"
                            : "bg-gradient-to-r from-blue-500 to-indigo-500"
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                      <li
                        className={`flex items-center gap-1 ${
                          /[A-Z]/.test(formData.password)
                            ? "text-green-600"
                            : "text-slate-500"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            /[A-Z]/.test(formData.password)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Uppercase letter
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          /[a-z]/.test(formData.password)
                            ? "text-green-600"
                            : "text-slate-500"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            /[a-z]/.test(formData.password)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Lowercase letter
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          /[0-9]/.test(formData.password)
                            ? "text-green-600"
                            : "text-slate-500"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            /[0-9]/.test(formData.password)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Number
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          /[^A-Za-z0-9]/.test(formData.password)
                            ? "text-green-600"
                            : "text-slate-500"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            /[^A-Za-z0-9]/.test(formData.password)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Special character
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          formData.password.length >= 8
                            ? "text-green-600"
                            : "text-slate-500"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            formData.password.length >= 8
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        8+ characters
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={validateConfirmPassword}
                    className={`pl-9 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleSendOtp();
                    setStep(1);
                  }}
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    !!errors.firstName ||
                    !!errors.lastName ||
                    !!errors.password ||
                    !!errors.confirmPassword
                  }
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link
              href={"#"} // Replace with actual link
              onClick={handleLogin}
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
