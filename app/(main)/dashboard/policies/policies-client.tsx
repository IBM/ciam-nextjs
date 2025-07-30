"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Search, Filter, Heart, Car, Home } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const icons: { [key: string]: React.ReactNode } = {
  Heart: <Heart className="h-5 w-5" />,
  Car: <Car className="h-5 w-5" />,
  Home: <Home className="h-5 w-5" />,
};

interface Policy {
  id: number;
  type: string;
  name: string;
  status: string;
  renewalDate: string;
  premium: string;
  coverage: string;
  policyNumber: string;
  startDate: string;
  icon: string;
  color: string;
  bgColor: string;
}

export function PoliciesClient({ policies }: { policies: Policy[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      policy.type.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search policies..."
            className="pl-9 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="border-slate-300 focus:ring-blue-500">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Policies</SelectItem>
              <SelectItem value="health">Health Insurance</SelectItem>
              <SelectItem value="auto">Auto Insurance</SelectItem>
              <SelectItem value="home">Home Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPolicies.length > 0 ? (
          filteredPolicies.map((policy) => (
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
                      {icons[policy.icon]}
                    </div>
                    <CardTitle className="text-base">{policy.type}</CardTitle>
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
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-500">Policy Number</p>
                      <p className="font-medium text-slate-800">
                        {policy.policyNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Start Date</p>
                      <p className="font-medium text-slate-800">
                        {policy.startDate}
                      </p>
                    </div>
                  </div>
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
                  <div className="text-sm">
                    <p className="text-slate-500">Coverage Amount</p>
                    <p className="font-medium text-slate-800">
                      {policy.coverage}
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
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600 mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              No policies found
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You don't have any policies yet. Add a new policy to get started."}
            </p>
            {!searchTerm && filterType === "all" && (
              <Link href="/dashboard/purchase" className="mt-4">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-4 w-4 mr-2" /> Add New Policy
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
