import Link from "next/link";
import {
  Shield,
  Home,
  Car,
  Heart,
  User,
  FileText,
  Plus,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserOrRedirect } from "@/lib/session";
import { PoliciesClient } from "./policies-client";
import { handleLogout } from "@/lib/utils";
// Helper function to get user initials
const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default async function PoliciesPage() {
  const user = await getUserOrRedirect();
  const userInitials = getInitials(user.name);

  const policies = [
    {
      id: 1,
      type: "Health Insurance",
      name: "Premium Health Plan",
      status: "Active",
      renewalDate: "Jan 15, 2026",
      premium: "$250/month",
      coverage: "$1,000,000",
      policyNumber: "H-12345-67",
      startDate: "Jan 15, 2025",
      icon: "Heart",
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      id: 2,
      type: "Auto Insurance",
      name: "Comprehensive Auto Coverage",
      status: "Active",
      renewalDate: "Mar 22, 2026",
      premium: "$120/month",
      coverage: "$300,000",
      policyNumber: "A-78901-23",
      startDate: "Mar 22, 2025",
      icon: "Car",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 3,
      type: "Home Insurance",
      name: "Home Protection Plus",
      status: "Active",
      renewalDate: "Aug 10, 2026",
      premium: "$180/month",
      coverage: "$500,000",
      policyNumber: "H-45678-90",
      startDate: "Aug 10, 2025",
      icon: "Home",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              VeriInsure
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/policies"
              className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1"
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
                    <h3 className="font-medium">{user.name}</h3>
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
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
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
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
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
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  My Policies
                </h1>
                <p className="text-slate-600">
                  Manage and review all your insurance policies
                </p>
              </div>
              <Link href="/dashboard/purchase">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-4 w-4 mr-2" /> Add New Policy
                </Button>
              </Link>
            </div>

            <PoliciesClient policies={policies} />
          </main>
        </div>
      </div>

      <footer className="w-full border-t py-4 bg-white mt-auto">
        <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              VeriInsure
            </span>
          </div>
          <p className="text-center text-xs text-slate-500 md:text-left">
            © 2025 VeriInsure. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
            >
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
