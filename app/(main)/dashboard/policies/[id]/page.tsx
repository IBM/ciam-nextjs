"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Shield,
  Home,
  Car,
  Heart,
  FileText,
  ArrowLeft,
  Download,
  Edit,
  Calendar,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function PolicyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const policyId = Number(params.id);

  // This would normally come from an API call
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
      icon: <Heart className="h-5 w-5" />,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
      description:
        "Comprehensive health coverage for individuals and families, including primary care, specialist visits, emergency services, prescription drugs, and mental health services.",
      documents: [
        { name: "Policy Document", type: "PDF", date: "Jan 15, 2025" },
        { name: "Coverage Details", type: "PDF", date: "Jan 15, 2025" },
        { name: "Insurance Card", type: "PDF", date: "Jan 16, 2025" },
      ],
      coverageDetails: [
        {
          name: "Primary Care Visits",
          value: "Covered (100% after $20 copay)",
        },
        { name: "Specialist Visits", value: "Covered (100% after $40 copay)" },
        {
          name: "Emergency Services",
          value: "Covered (100% after $150 copay)",
        },
        { name: "Hospital Stay", value: "Covered (100% after $250 per day)" },
        {
          name: "Prescription Drugs",
          value: "Covered (Generic: $10, Brand: $30)",
        },
        { name: "Mental Health", value: "Covered (100% after $20 copay)" },
        { name: "Annual Deductible", value: "$500 individual / $1,000 family" },
        {
          name: "Out-of-Pocket Maximum",
          value: "$3,000 individual / $6,000 family",
        },
      ],
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
      icon: <Car className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description:
        "Full coverage auto insurance including liability, collision, comprehensive, uninsured motorist protection, and roadside assistance.",
      documents: [
        { name: "Policy Document", type: "PDF", date: "Mar 22, 2025" },
        { name: "Insurance Card", type: "PDF", date: "Mar 23, 2025" },
        { name: "Vehicle Details", type: "PDF", date: "Mar 22, 2025" },
      ],
      coverageDetails: [
        {
          name: "Bodily Injury Liability",
          value: "$100,000 per person / $300,000 per accident",
        },
        { name: "Property Damage Liability", value: "$50,000 per accident" },
        { name: "Collision", value: "Covered (after $500 deductible)" },
        { name: "Comprehensive", value: "Covered (after $500 deductible)" },
        {
          name: "Uninsured Motorist",
          value: "$100,000 per person / $300,000 per accident",
        },
        { name: "Medical Payments", value: "$5,000 per person" },
        { name: "Roadside Assistance", value: "Included" },
        {
          name: "Rental Car Reimbursement",
          value: "$30 per day (up to 30 days)",
        },
      ],
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
      icon: <Home className="h-5 w-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      description:
        "Comprehensive home insurance covering dwelling, personal property, liability, and additional living expenses in case of covered events.",
      documents: [
        { name: "Policy Document", type: "PDF", date: "Aug 10, 2025" },
        { name: "Coverage Details", type: "PDF", date: "Aug 10, 2025" },
        { name: "Home Inventory", type: "PDF", date: "Aug 15, 2025" },
      ],
      coverageDetails: [
        { name: "Dwelling Coverage", value: "$500,000" },
        { name: "Other Structures", value: "$50,000" },
        { name: "Personal Property", value: "$250,000" },
        { name: "Loss of Use", value: "$100,000" },
        { name: "Personal Liability", value: "$300,000 per occurrence" },
        { name: "Medical Payments", value: "$5,000 per person" },
        { name: "Deductible", value: "$1,000" },
        { name: "Water Backup", value: "$5,000" },
        {
          name: "Extended Replacement Cost",
          value: "25% above dwelling limit",
        },
      ],
    },
  ];

  const policy = policies.find((p) => p.id === policyId);

  if (!policy) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600 mx-auto mb-4 w-fit">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Policy Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The policy you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => router.push("/dashboard/policies")}
            className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Policies
          </Button>
        </div>
      </div>
    );
  }

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
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                  JD
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/policies")}
            className="mb-4 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Policies
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full ${policy.bgColor} p-3 ${policy.color}`}
              >
                {policy.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  {policy.name}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-slate-600">{policy.type}</p>
                  <span className="text-slate-400">•</span>
                  <p className="text-slate-600">
                    Policy #{policy.policyNumber}
                  </p>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className="w-fit bg-green-50 text-green-700 border-green-200 text-sm px-3 py-1"
            >
              {policy.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white shadow-md border-none">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Policy Details
                </CardTitle>
                <CardDescription>{policy.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="coverage">
                  <TabsList className="bg-slate-100 p-1 rounded-lg w-full justify-start space-x-2">
                    <TabsTrigger
                      value="coverage"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md"
                    >
                      Coverage
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md"
                    >
                      Documents
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="coverage" className="pt-4">
                    <div className="space-y-4">
                      {policy.coverageDetails.map((detail, index) => (
                        <div
                          key={index}
                          className="flex justify-between pb-2 border-b border-slate-100"
                        >
                          <span className="text-slate-600">{detail.name}</span>
                          <span className="font-medium text-slate-800">
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="documents" className="pt-4">
                    <div className="space-y-2">
                      {policy.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {doc.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {doc.type} • {doc.date}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:bg-blue-100"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white shadow-md border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Policy Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Policy Number</p>
                  <p className="font-medium text-slate-800">
                    {policy.policyNumber}
                  </p>
                </div>
                <Separator className="bg-slate-100" />
                <div>
                  <p className="text-sm text-slate-500">Coverage Amount</p>
                  <p className="font-medium text-slate-800">
                    {policy.coverage}
                  </p>
                </div>
                <Separator className="bg-slate-100" />
                <div>
                  <p className="text-sm text-slate-500">Premium</p>
                  <p className="font-medium text-slate-800">{policy.premium}</p>
                </div>
                <Separator className="bg-slate-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Start Date</p>
                    <p className="font-medium text-slate-800">
                      {policy.startDate}
                    </p>
                  </div>
                  {/* <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <Calendar className="h-4 w-4" />
                  </div> */}
                </div>
                <Separator className="bg-slate-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Renewal Date</p>
                    <p className="font-medium text-slate-800">
                      {policy.renewalDate}
                    </p>
                  </div>
                  {/* <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <Calendar className="h-4 w-4" />
                  </div> */}
                </div>
              </CardContent>
              {/* <CardFooter>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all">
                  <Edit className="h-4 w-4 mr-2" /> Update Policy
                </Button>
              </CardFooter> */}
            </Card>

            {/* <Card className="bg-white shadow-md border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Have questions about your policy? Our customer service team is
                  here to help.
                </p>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">1-800-VERI-INSURE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">
                    support@veriinsure.com
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Contact Support
                </Button>
              </CardFooter>
            </Card> */}
          </div>
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
