import Link from "next/link";
import {
  Shield,
  Plus,
  Home,
  Car,
  Heart,
  Briefcase,
  User,
  FileText,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { getUserOrRedirect } from "@/lib/session";
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

// Mock data for policies - in a real app, this would come from an API
const activePolicies = [
  {
    id: 1,
    type: "Health Insurance",
    name: "Premium Health Plan",
    status: "Active",
    renewalDate: "Jan 15, 2026",
    premium: "$250/month",
    icon: <Heart className="h-5 w-5" />,
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
    icon: <Car className="h-5 w-5" />,
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
    icon: <Home className="h-5 w-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

export default async function DashboardPage() {
  const user = await getUserOrRedirect();
  const userInitials = getInitials(user.name);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link className="flex items-center gap-2" href="/">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              VeriInsure
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1"
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
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600">
                Welcome back, {user.name}! Here's an overview of your insurance
                portfolio.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white shadow-md hover:shadow-lg transition-all border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Policies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    3
                  </div>
                  <p className="text-xs text-slate-500">Active policies</p>
                  <Progress
                    value={75}
                    className="mt-2 h-1.5 bg-slate-100"
                    indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md hover:shadow-lg transition-all border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Monthly Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    $550
                  </div>
                  <p className="text-xs text-slate-500">
                    Next payment: June 1, 2025
                  </p>
                  <Progress
                    value={30}
                    className="mt-2 h-1.5 bg-slate-100"
                    indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md hover:shadow-lg transition-all border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Coverage Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    85%
                  </div>
                  <p className="text-xs text-slate-500">Good coverage</p>
                  <Progress
                    value={85}
                    className="mt-2 h-1.5 bg-slate-100"
                    indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md hover:shadow-lg transition-all border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    $320
                  </div>
                  <p className="text-xs text-slate-500">Annual savings</p>
                  <Progress
                    value={65}
                    className="mt-2 h-1.5 bg-slate-100"
                    indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="policies" className="w-full">
                <TabsList className="mb-4 bg-white p-1 rounded-lg shadow-md w-full justify-start space-x-2">
                  <TabsTrigger
                    value="policies"
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md"
                  >
                    My Policies
                  </TabsTrigger>
                  <TabsTrigger
                    value="recommendations"
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md"
                  >
                    Recommendations
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="policies" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activePolicies.map((policy) => (
                      <Card
                        key={policy.id}
                        className="bg-white shadow-md hover:shadow-lg transition-all border-none overflow-hidden"
                      >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`rounded-full ${policy.bgColor} p-2 ${policy.color}`}
                              >
                                {policy.icon}
                              </div>
                              <CardTitle className="text-base">
                                {policy.type}
                              </CardTitle>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {policy.status}
                            </Badge>
                          </div>
                          <CardDescription>{policy.name}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-slate-500">Premium</p>
                              <p className="font-medium text-slate-800">
                                {policy.premium}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Renewal</p>
                              <p className="font-medium text-slate-800">
                                {policy.renewalDate}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link
                            href={`/dashboard/policies/${policy.id}`}
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              View Details
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                    <Card className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md hover:shadow-lg transition-all border-none">
                      <div className="rounded-full bg-blue-100 p-4 text-blue-600">
                        <Plus className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-slate-800">
                        Add New Policy
                      </h3>
                      <p className="mt-2 text-center text-sm text-slate-600">
                        Explore our range of insurance policies to find the
                        right coverage for you.
                      </p>
                      <Link href="/dashboard/purchase" className="mt-4 w-full">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all">
                          Purchase Policy
                        </Button>
                      </Link>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="recommendations">
                  <Card className="bg-white shadow-md border-none">
                    <CardHeader>
                      <CardTitle className="text-xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                        Recommended for You
                      </CardTitle>
                      <CardDescription>
                        Based on your current coverage and profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4 bg-white shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800">
                                Life Insurance
                              </h4>
                              <p className="text-sm text-slate-600">
                                Protect your family's financial future with our
                                comprehensive life insurance plans.
                              </p>
                            </div>
                            <Link href="/dashboard/purchase?type=life">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-sm hover:shadow-md transition-all"
                              >
                                Explore
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="rounded-lg border p-4 bg-white shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                              <Shield className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800">
                                Umbrella Insurance
                              </h4>
                              <p className="text-sm text-slate-600">
                                Additional liability coverage that provides
                                protection beyond your existing policies.
                              </p>
                            </div>
                            <Link href="/dashboard/purchase?type=umbrella">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-sm hover:shadow-md transition-all"
                              >
                                Explore
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
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
