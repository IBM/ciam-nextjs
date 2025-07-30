"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Save,
  User,
  FileText,
  Plus,
  LogOut,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  getChangePasswordUrl,
  generateOtp,
  verifyOtp,
  generateSmsOTP,
  verifySmsOTP,
} from "@/lib/auth";
import { useRouter } from "next/navigation";
// Define the structures for the props
interface UserSession {
  name: string;
  email: string;
  role: string;
}

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

interface ProfileClientProps {
  user: UserSession;
  profile: UserProfile | null;
}

export function ProfileClient({
  user,
  profile: initialProfile,
}: ProfileClientProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  // Form state
  const [firstName, setFirstName] = useState(profile?.name?.givenName || "");
  const [lastName, setLastName] = useState(profile?.name?.familyName || "");
  const [streetAddress, setStreetAddress] = useState(
    profile?.addresses?.[0]?.streetAddress || ""
  );
  const [locality, setLocality] = useState(
    profile?.addresses?.[0]?.locality || ""
  );
  const [region, setRegion] = useState(profile?.addresses?.[0]?.region || "");
  const [postalCode, setPostalCode] = useState(
    profile?.addresses?.[0]?.postalCode || ""
  );
  const [country, setCountry] = useState(
    profile?.addresses?.[0]?.country || ""
  );

  // OTP state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [updateType, setUpdateType] = useState<"email" | "phone" | null>(null);
  const [newValue, setNewValue] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailDifferent, setIsEmailDifferent] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPhoneDifferent, setIsPhoneDifferent] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [correlation, setCorrelation] = useState<any>(null);
  const [otpId, setOtpId] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/me");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data);
        setFirstName(data.name?.givenName || "");
        setLastName(data.name?.familyName || "");
        const address = data.addresses?.[0];
        if (address) {
          setStreetAddress(address.streetAddress || "");
          setLocality(address.locality || "");
          setRegion(address.region || "");
          setPostalCode(address.postalCode || "");
          setCountry(address.country || "");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast({
          title: "Error",
          description: "Could not load detailed profile information.",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = profile?.displayName || user.name;
  const userInitials = getInitials(displayName);

  const primaryEmail =
    profile?.emails?.find((e) => e.type === "primary")?.value ||
    profile?.emails?.[0]?.value ||
    user.email;
  const primaryPhoneNumber =
    profile?.phoneNumbers?.find(
      (p) => p.type === "mobile" || p.type === "primary"
    )?.value ||
    profile?.phoneNumbers?.[0]?.value ||
    "N/A";
  const primaryAddress =
    profile?.addresses?.find((a) => a.type === "home" || a.type === "primary")
      ?.formatted ||
    profile?.addresses?.[0]?.formatted ||
    "N/A";
  const memberSinceDate = profile?.meta?.created
    ? new Date(profile.meta.created).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  const updateProfile = async (updatedData: any) => {
    const response = await fetch("/api/me", {
      method: "PUT",
      headers: { "Content-Type": "application/scim+json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return await response.json();
  };

  const handleSave = async () => {
    setIsSaving(true);

    const updatedProfileData = {
      schemas: [
        "urn:ietf:params:scim:schemas:core:2.0:User",
        "urn:ietf:params:scim:schemas:extension:ibm:2.0:User",
      ],
      name: {
        givenName: firstName,
        familyName: lastName,
      },
      addresses: [
        {
          streetAddress,
          locality,
          region,
          postalCode,
          country,
          type: "work",
        },
      ],
      active: true,
      userName: primaryEmail,
    };

    try {
      const updatedProfile = await updateProfile(updatedProfileData);
      setProfile(updatedProfile);
      toast({ title: "Success", description: "Profile updated successfully." });
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getRandomInt = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const handleOtpRequest = async (type: "email" | "phone", value: string) => {
    if (!value) {
      toast({
        title: "Error",
        description: "Please enter a value.",
        variant: "destructive",
      });
      return;
    }
    setUpdateType(type);
    setNewValue(value);
    setOtpSent(false);
    setOtpError("");
    setOtpModalOpen(true);
    let otpPrefix = getRandomInt();
    setCorrelation(() => otpPrefix);
    if (type === "email") {
      const otpRequest = await generateOtp(value, otpPrefix);
      if (otpRequest.id) {
        setOtpId(otpRequest.id);
        setOtpSent(true);
        setCountdown(30);
      } else {
        const errorMsg =
          "An error occurred while sending otp. Please retry again.";
        setOtpError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } else {
      const otpRequest = await generateSmsOTP(
        `${countryCode}${value}`,
        otpPrefix
      );
      if (otpRequest.id) {
        setOtpId(otpRequest.id);
        setOtpSent(true);
        setCountdown(30);
      } else {
        const errorMsg =
          "An error occurred while sending otp. Please retry again.";
        setOtpError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    }
  };

  const handleOtpVerify = async () => {
    if (otpValue.length !== 6) {
      setOtpError("Please enter a 6-digit OTP.");
      return;
    }
    setIsVerifying(true);
    setOtpError("");
    let verifyOtpResponse;
    if (updateType === "email") {
      verifyOtpResponse = await verifyOtp(otpValue, otpId);
    } else {
      verifyOtpResponse = await verifySmsOTP(otpValue, otpId);
    }
    if (verifyOtpResponse.assertion) {
      try {
        const currentProfile = profile || {};
        const updatedData = {
          ...currentProfile,
          schemas: [
            "urn:ietf:params:scim:schemas:core:2.0:User",
            "urn:ietf:params:scim:schemas:extension:ibm:2.0:User",
          ],
          ...(updateType === "email" && {
            emails: [{ type: "work", value: newEmail }],
            userName: newEmail,
          }),
          ...(updateType === "phone" && {
            phoneNumbers: [
              { value: `${countryCode}${newValue}`, type: "work" },
            ],
          }),
        };

        const updatedProfile = await updateProfile(updatedData);
        setProfile(updatedProfile);

        toast({
          title: "Success",
          description: `${
            updateType === "email" ? "Email" : "Phone"
          } updated successfully.`,
        });
        setOtpModalOpen(false);
        setOtpValue("");
        setNewValue("");
        if (updateType === "phone") {
          setNewPhone("");
        }
      } catch (error) {
        console.error("Update error after OTP verification:", error);
        const errorMsg = "Failed to update profile. Please try again.";
        setOtpError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } else {
      const errorMsg = "Invalid OTP. Please try again.";
      setOtpError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
    setIsVerifying(false);
  };

  const handlePasswordChange = async () => {
    const data = await getChangePasswordUrl();
    if (data) {
      const changePassUrl = data.url + primaryEmail + "&" + data.themeID;
      // console.log(changePassUrl);
      router.push(changePassUrl);
    } else {
      console.error("redirect error:", data);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/me", { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      // Log the user out and redirect
      handleLogout();
    } catch (error) {
      console.error("Delete account error:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleLogout = async () => {
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
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href={"/"} className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              VeriInsure
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/policies"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              My Policies
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Avatar className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
              <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white/50">
                    <AvatarFallback className="bg-white/20 text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{displayName}</h3>
                    <p className="text-xs text-blue-100 capitalize">
                      {user.role} Member
                    </p>
                  </div>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-layout-dashboard"
                      >
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/policies"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <FileText className="h-5 w-5" />
                      My Policies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/purchase"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      New Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                  </li>
                  {/* <li>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </li> */}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Profile
                </h1>
                <p className="text-slate-600">
                  Manage your account settings and preferences
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="gap-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                    >
                      {isSaving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                  >
                    Edit Profile
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 gap-1"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-5">
              <Card className="md:col-span-2 border-none shadow-lg bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                    Your Profile
                  </CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-30 blur"></div>
                    <Avatar className="h-24 w-24 relative border-4 border-white">
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-slate-800">
                      {displayName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Member since {memberSinceDate}
                    </p>
                  </div>
                  {!profile ? (
                    <p className="text-red-500 text-center">
                      Could not load detailed profile information.
                    </p>
                  ) : (
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <span className="text-sm text-slate-500">Email</span>
                        <span className="text-sm font-medium text-slate-700">
                          {primaryEmail}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <span className="text-sm text-slate-500">Phone</span>
                        <span className="text-sm font-medium text-slate-700">
                          {primaryPhoneNumber}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="w-full pt-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <span className="text-sm">Membership</span>
                      <span className="text-sm font-medium capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-3 space-y-6">
                <Tabs defaultValue="personal">
                  <TabsList className="mb-4 bg-white p-1 rounded-lg shadow-md w-full justify-start space-x-2">
                    <TabsTrigger
                      value="personal"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md"
                    >
                      <User className="h-4 w-4 mr-2" /> Personal Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="contact"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md"
                    >
                      <Phone className="h-4 w-4 mr-2" /> Contact Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md"
                    >
                      <Shield className="h-4 w-4 mr-2" /> Security
                    </TabsTrigger>
                  </TabsList>

                  {/* Personal Info Tab */}
                  <TabsContent value="personal">
                    <Card className="border-none shadow-lg bg-white">
                      <CardHeader>
                        <CardTitle className="text-xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                          Personal Information
                        </CardTitle>
                        <CardDescription>
                          Update your personal details. Click 'Edit Profile' to
                          make changes.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label
                              htmlFor="first-name"
                              className="text-slate-700"
                            >
                              First Name
                            </Label>
                            <Input
                              id="first-name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              disabled={!isEditing}
                              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="last-name"
                              className="text-slate-700"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="last-name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              disabled={!isEditing}
                              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <Separator />
                        <h3 className="text-lg font-medium text-slate-800">
                          Address
                        </h3>
                        <div className="space-y-2">
                          <Label htmlFor="street-address">Street Address</Label>
                          <Input
                            id="street-address"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="locality">City / Locality</Label>
                            <Input
                              id="locality"
                              value={locality}
                              onChange={(e) => setLocality(e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="region">State / Region</Label>
                            <Input
                              id="region"
                              value={region}
                              onChange={(e) => setRegion(e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="postal-code">
                              ZIP / Postal Code
                            </Label>
                            <Input
                              id="postal-code"
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Contact Info Tab */}
                  <TabsContent value="contact">
                    <Card className="border-none shadow-lg bg-white">
                      <CardHeader>
                        <CardTitle className="text-xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                          Contact Information
                        </CardTitle>
                        <CardDescription>
                          Manage your email and phone number. Updates require
                          OTP verification.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Email Update */}
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                          <Label className="text-lg font-medium text-slate-800 flex items-center">
                            <Mail className="mr-2 h-5 w-5 text-blue-600" />{" "}
                            Email Address
                          </Label>
                          <p className="text-sm text-slate-600 mt-1">
                            Current: {primaryEmail}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Input
                              id="email-update"
                              placeholder="New email address"
                              className="flex-grow"
                              value={newEmail}
                              onChange={(e) => {
                                const email = e.target.value;
                                setNewEmail(email);
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                setIsEmailValid(emailRegex.test(email));
                                setIsEmailDifferent(email !== primaryEmail);
                              }}
                            />
                            <Button
                              onClick={() =>
                                handleOtpRequest("email", newEmail)
                              }
                              disabled={!isEmailValid || !isEmailDifferent}
                            >
                              Update Email
                            </Button>
                          </div>
                        </div>
                        {/* Phone Update */}
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                          <Label className="text-lg font-medium text-slate-800 flex items-center">
                            <Phone className="mr-2 h-5 w-5 text-blue-600" />{" "}
                            Phone Number
                          </Label>
                          <p className="text-sm text-slate-600 mt-1">
                            Current: {primaryPhoneNumber}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Select
                              defaultValue="+91"
                              onValueChange={setCountryCode}
                            >
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+91">+91</SelectItem>
                                <SelectItem value="+1">+1</SelectItem>
                                <SelectItem value="+44">+44</SelectItem>

                                {/* Add more country codes as needed */}
                              </SelectContent>
                            </Select>
                            <Input
                              id="phone-update"
                              placeholder="New phone number"
                              className="flex-grow"
                              value={newPhone}
                              onChange={(e) => {
                                const phone = e.target.value;
                                setNewPhone(phone);
                                const phoneRegex = /^\d{10}$/;
                                setIsPhoneValid(phoneRegex.test(phone));
                                setIsPhoneDifferent(
                                  `${countryCode}${phone}` !==
                                    primaryPhoneNumber
                                );
                              }}
                            />
                            <Button
                              onClick={() =>
                                handleOtpRequest("phone", newPhone)
                              }
                              disabled={!isPhoneValid}
                            >
                              Update Phone
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Security Tab */}
                  <TabsContent value="security">
                    <Card className="border-none shadow-lg bg-white">
                      <CardHeader>
                        <CardTitle className="text-xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                          Security Settings
                        </CardTitle>
                        <CardDescription>
                          Manage your account security settings.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4 p-4 rounded-lg bg-slate-50">
                          <h3 className="text-lg font-medium text-slate-800">
                            Change Password
                          </h3>
                          <p className="text-sm text-slate-600">
                            Password changes should be handled through your
                            identity provider.
                          </p>
                          <Button onClick={handlePasswordChange}>
                            Change on Provider
                          </Button>
                        </div>
                        <Separator className="bg-slate-200" />
                        <div className="space-y-4 p-4 rounded-lg bg-red-50 border border-red-200">
                          <h3 className="text-lg font-medium text-red-800">
                            Delete Account
                          </h3>
                          <p className="text-sm text-red-600">
                            Permanently delete your account and all associated
                            data. This action cannot be undone.
                          </p>
                          <Button
                            variant="destructive"
                            onClick={() => setDeleteModalOpen(true)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete My Account
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Dialog open={otpModalOpen} onOpenChange={setOtpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify your new {updateType}</DialogTitle>
            <DialogDescription>
              {otpSent
                ? `Enter the 6-digit OTP sent to ${newValue}.`
                : "Requesting OTP..."}
            </DialogDescription>
          </DialogHeader>
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
                    onClick={() => {
                      if (updateType) {
                        handleOtpRequest(updateType, newValue);
                      }
                    }}
                    disabled={isVerifying}
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
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  maxLength={6}
                  className={`border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                    otpError ? "border-red-500" : ""
                  }`}
                />
              </div>
              {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOtpModalOpen(false);
                setOtpValue("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOtpVerify}
              disabled={!otpSent || isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify & Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, delete my account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
