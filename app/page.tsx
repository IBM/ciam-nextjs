"use client";
import Link from "next/link";
import Image from "next/image";
import { Shield, FileText, Clock, Phone, ArrowRight } from "lucide-react";
import { getLoginUrl } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginState, setLoginState] = useState(
    searchParams.get("code") || searchParams.get("error") ? true : false
  );

  useEffect(() => {
    const code = searchParams.get("code");
    const authError = searchParams.get("error");

    if (authError) {
      setError(
        `Authentication failed: ${
          searchParams.get("error_description") || authError
        }`
      );
      router.replace("/", undefined);
      return;
    }

    if (code) {
      setIsLoading(true);
      setError(null);
      const login = async () => {
        try {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                errorData.details ||
                "Failed to complete login."
            );
          }
          router.replace("/dashboard");
        } catch (err: any) {
          console.error("Error during login:", err);
          setError(err.message || "An unexpected error occurred during login.");
          router.replace("/");
          setIsLoading(false);
          setLoginState(false);
        }
      };
      login();
    }
  }, [searchParams, router]);

  const handleLogin = async () => {
    setError(null);
    const loginUrl = await getLoginUrl();
    if (loginUrl) {
      router.push(loginUrl);
    } else {
      console.error("Login error:", loginUrl);
      setError("Failed to initiate login.");
    }
  };

  if (loginState) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
        {isLoading && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-100 flex items-center justify-center z-[100]">
            <div className="bg-white p-6 rounded-lg shadow-xl flex justify-center items-center gap-4">
              <PuffLoader color="#0043ce" speedMultiplier={1.5} />
              <p className="text-lg font-medium text-slate-700">
                Processing login...
              </p>
            </div>
          </div>
        )}
        {error && (
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg z-[100]"
            role="alert"
          >
            <strong className="font-bold">Login Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-100 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-xl flex justify-center items-center gap-4">
            <PuffLoader color="#0043ce" speedMultiplier={1.5} />
            <p className="text-lg font-medium text-slate-700">
              Processing login...
            </p>
          </div>
        </div>
      )}
      {error && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg z-[100]"
          role="alert"
        >
          <strong className="font-bold">Login Error:</strong>
          <span className="block sm:inline"> {error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              VeriInsure
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#policies"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Policies
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={handleLogin}
              >
                Log in
              </Button>
            </div>
            <Link href="/signup" className="hidden md:block">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-200 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 mb-2">
                  Trusted by 10,000+ customers
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Protect What Matters Most with VeriInsure
                </h1>
                <p className="max-w-[600px] text-slate-600 md:text-xl">
                  Comprehensive insurance solutions tailored to your needs.
                  Simple management, transparent policies, and exceptional
                  service.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="gap-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                    >
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto relative">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r  opacity-30 blur-lg"></div>
                <Image
                  src="/4412.jpg?height=550&width=550"
                  alt="Insurance Protection"
                  width={550}
                  height={550}
                  className="rounded-xl object-cover relative shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 mb-2">
                Why Choose Us
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Why Choose VeriInsure
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We make insurance simple, transparent, and hassle-free
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-md hover:shadow-lg transition-all bg-gradient-to-b from-white to-slate-50">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Comprehensive Coverage</h3>
                <p className="text-center text-slate-600">
                  Tailored insurance solutions that provide complete protection
                  for all your needs.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-md hover:shadow-lg transition-all bg-gradient-to-b from-white to-slate-50">
                <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Easy Management</h3>
                <p className="text-center text-slate-600">
                  Manage your policies, make changes, and access documents all
                  in one place.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-md hover:shadow-lg transition-all bg-gradient-to-b from-white to-slate-50">
                <div className="rounded-full bg-sky-100 p-3 text-sky-600">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">24/7 Support</h3>
                <p className="text-center text-slate-600">
                  Our dedicated team is always available to assist you with any
                  questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="policies"
          className="w-full py-12 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 mb-2">
                Our Offerings
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Our Insurance Policies
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find the perfect coverage for your personal and business needs
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-all">
                <div className="rounded-full bg-rose-100 p-3 w-fit text-rose-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Health Insurance</h3>
                <p className="mt-2 text-slate-600">
                  Comprehensive health coverage for individuals and families.
                </p>
                <div className="mt-auto pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={handleLogin}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex flex-col rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-all">
                <div className="rounded-full bg-blue-100 p-3 w-fit text-blue-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-car"
                  >
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Auto Insurance</h3>
                <p className="mt-2 text-slate-600">
                  Protection for your vehicles with flexible coverage options.
                </p>
                <div className="mt-auto pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={handleLogin}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex flex-col rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-all">
                <div className="rounded-full bg-amber-100 p-3 w-fit text-amber-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-home"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Home Insurance</h3>
                <p className="mt-2 text-slate-600">
                  Safeguard your home and belongings against unexpected events.
                </p>
                <div className="mt-auto pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={handleLogin}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 mb-2">
                Testimonials
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  What Our Clients Say
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from our satisfied customers about their experience with
                  VeriInsure
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col rounded-xl border p-6 shadow-md hover:shadow-lg transition-all bg-gradient-to-b from-white to-slate-50">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-slate-500">Health Insurance</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-600">
                  "The process was incredibly smooth. I was able to find the
                  perfect health insurance plan for my family in minutes."
                </p>
              </div>
              <div className="flex flex-col rounded-xl border p-6 shadow-md hover:shadow-lg transition-all bg-gradient-to-b from-white to-slate-50">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium">Michael Chen</p>
                    <p className="text-xs text-slate-500">Auto Insurance</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-600">
                  "Their customer service is exceptional. When I had an
                  accident, they handled my claim quickly and efficiently."
                </p>
              </div>
              <div className="flex flex-col rounded-xl border p-6 shadow-md hover:shadow-lg transition-all bg-gradient-to-b from-white to-slate-50">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium">Emily Rodriguez</p>
                    <p className="text-xs text-slate-500">Home Insurance</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-600">
                  "The online portal makes it so easy to manage my policies. I
                  can make changes and view documents anytime."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="w-full py-12 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Get insured today!
                </h2>
                <p className="max-w-[600px] text-slate-600 md:text-xl">
                  Signup today and get started with your insurance coverage.
                </p>
                <div className="pt-4">
                  <Link href="/signup" className="hidden md:block">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-8 bg-white">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              VeriInsure
            </span>
          </div>
          <p className="text-center text-sm text-slate-500 md:text-left">
            © 2025 VeriInsure. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
