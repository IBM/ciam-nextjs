"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - in a real app, this would be an API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex min-h-screen items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 lg:gap-20">
          <div className="flex flex-col justify-center space-y-6 p-8 bg-white rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent"
              >
                VeriInsure
              </Link>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-slate-600">
                Enter your credentials to access your account
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-30 blur-lg"></div>
            <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-50 p-6 shadow-md">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Manage your insurance with ease
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700">
                      View and manage all your policies
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700">
                      Access policy documents anytime
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700">
                      Update your coverage when needed
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700">
                      Get 24/7 customer support
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
