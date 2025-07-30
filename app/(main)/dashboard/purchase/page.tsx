"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  ArrowLeft,
  Home,
  Car,
  Heart,
  Briefcase,
  Umbrella,
  Check,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PurchasePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "health";

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard?success=true");
      }, 1500);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/dashboard");
    }
  };

  const insuranceTypes = [
    {
      id: "health",
      name: "Health Insurance",
      icon: <Heart className="h-5 w-5" />,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      id: "auto",
      name: "Auto Insurance",
      icon: <Car className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "home",
      name: "Home Insurance",
      icon: <Home className="h-5 w-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      id: "life",
      name: "Life Insurance",
      icon: <Briefcase className="h-5 w-5" />,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
    },
    {
      id: "umbrella",
      name: "Umbrella Insurance",
      icon: <Umbrella className="h-5 w-5" />,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
  ];

  const plans = {
    health: [
      {
        id: "basic",
        name: "Basic Health",
        price: "$150/month",
        features: [
          "Primary care visits",
          "Emergency services",
          "Prescription drugs",
        ],
      },
      {
        id: "premium",
        name: "Premium Health",
        price: "$250/month",
        features: [
          "Primary care visits",
          "Specialist visits",
          "Emergency services",
          "Prescription drugs",
          "Mental health services",
        ],
      },
      {
        id: "family",
        name: "Family Plan",
        price: "$350/month",
        features: [
          "Coverage for the whole family",
          "Primary care visits",
          "Specialist visits",
          "Emergency services",
          "Prescription drugs",
          "Mental health services",
          "Dental and vision",
        ],
      },
    ],
    auto: [
      {
        id: "liability",
        name: "Liability Only",
        price: "$80/month",
        features: ["Bodily injury liability", "Property damage liability"],
      },
      {
        id: "comprehensive",
        name: "Comprehensive",
        price: "$120/month",
        features: [
          "Bodily injury liability",
          "Property damage liability",
          "Collision coverage",
          "Comprehensive coverage",
        ],
      },
      {
        id: "premium",
        name: "Premium Auto",
        price: "$160/month",
        features: [
          "Bodily injury liability",
          "Property damage liability",
          "Collision coverage",
          "Comprehensive coverage",
          "Roadside assistance",
          "Rental car reimbursement",
        ],
      },
    ],
    home: [
      {
        id: "basic",
        name: "Basic Home",
        price: "$100/month",
        features: [
          "Dwelling coverage",
          "Personal property coverage",
          "Liability protection",
        ],
      },
      {
        id: "standard",
        name: "Standard Home",
        price: "$180/month",
        features: [
          "Dwelling coverage",
          "Personal property coverage",
          "Liability protection",
          "Additional living expenses",
          "Medical payments",
        ],
      },
      {
        id: "premium",
        name: "Premium Home",
        price: "$250/month",
        features: [
          "Dwelling coverage",
          "Personal property coverage",
          "Liability protection",
          "Additional living expenses",
          "Medical payments",
          "Scheduled personal property",
          "Water backup coverage",
        ],
      },
    ],
    life: [
      {
        id: "term",
        name: "Term Life",
        price: "$30/month",
        features: [
          "Coverage for a specific term",
          "Death benefit",
          "No cash value",
        ],
      },
      {
        id: "whole",
        name: "Whole Life",
        price: "$150/month",
        features: [
          "Lifetime coverage",
          "Death benefit",
          "Cash value accumulation",
          "Fixed premiums",
        ],
      },
      {
        id: "universal",
        name: "Universal Life",
        price: "$200/month",
        features: [
          "Lifetime coverage",
          "Death benefit",
          "Cash value accumulation",
          "Flexible premiums",
          "Investment options",
        ],
      },
    ],
    umbrella: [
      {
        id: "basic",
        name: "Basic Umbrella",
        price: "$25/month",
        features: [
          "$1 million in additional liability coverage",
          "Coverage beyond auto and home policies",
        ],
      },
      {
        id: "standard",
        name: "Standard Umbrella",
        price: "$40/month",
        features: [
          "$2 million in additional liability coverage",
          "Coverage beyond auto and home policies",
          "Worldwide coverage",
        ],
      },
      {
        id: "premium",
        name: "Premium Umbrella",
        price: "$60/month",
        features: [
          "$5 million in additional liability coverage",
          "Coverage beyond auto and home policies",
          "Worldwide coverage",
          "Legal defense costs",
        ],
      },
    ],
  };

  const currentPlans =
    plans[selectedType as keyof typeof plans] || plans.health;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent"
            >
              VeriInsure
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Purchase a New Policy
              </h1>
              <p className="text-slate-600">
                Find the right coverage for your needs
              </p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between">
                <div
                  className={`flex flex-col items-center ${
                    step >= 1 ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md ${
                      step >= 1
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                  </div>
                  <span className="mt-2 text-xs font-medium">Select Type</span>
                </div>
                <div className="flex-1 self-center">
                  <div
                    className={`h-1 w-full rounded-full ${
                      step >= 2
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500"
                        : "bg-slate-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 2 ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md ${
                      step >= 2
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    {step > 2 ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <span className="mt-2 text-xs font-medium">Choose Plan</span>
                </div>
                <div className="flex-1 self-center">
                  <div
                    className={`h-1 w-full rounded-full ${
                      step >= 3
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500"
                        : "bg-slate-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 3 ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md ${
                      step >= 3
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    3
                  </div>
                  <span className="mt-2 text-xs font-medium">Confirm</span>
                </div>
              </div>
            </div>

            {step === 1 && (
              <Card className="border-none shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                    Select Insurance Type
                  </CardTitle>
                  <CardDescription>
                    Choose the type of insurance you want to purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedType}
                    onValueChange={setSelectedType}
                    className="space-y-3"
                  >
                    {insuranceTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                          selectedType === type.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <RadioGroupItem
                          value={type.id}
                          id={type.id}
                          className="text-blue-600"
                        />
                        <Label
                          htmlFor={type.id}
                          className="flex items-center gap-3 cursor-pointer w-full"
                        >
                          <div
                            className={`rounded-full ${type.bgColor} p-2 ${type.color}`}
                          >
                            {type.icon}
                          </div>
                          <span className="font-medium text-slate-700">
                            {type.name}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card className="border-none shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                    Choose Your Plan
                  </CardTitle>
                  <CardDescription>
                    Select the coverage that best fits your needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedPlan}
                    onValueChange={setSelectedPlan}
                    className="space-y-4"
                  >
                    {currentPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`rounded-lg border p-4 transition-all ${
                          selectedPlan === plan.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <RadioGroupItem
                          value={plan.id}
                          id={plan.id}
                          className="sr-only"
                        />
                        <Label htmlFor={plan.id} className="cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-slate-800">
                                {plan.name}
                              </h3>
                              <p className="text-sm text-blue-600 font-bold">
                                {plan.price}
                              </p>
                            </div>
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                                selectedPlan === plan.id
                                  ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white"
                                  : "border border-slate-300"
                              }`}
                            >
                              {selectedPlan === plan.id && (
                                <Check className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm font-medium text-slate-700">
                              Features:
                            </p>
                            <ul className="mt-2 space-y-2 text-sm text-slate-600">
                              {plan.features.map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <div className="rounded-full bg-blue-100 p-1 text-blue-600">
                                    <Check className="h-3 w-3" />
                                  </div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={!selectedPlan}
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card className="border-none shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                    Complete Your Purchase
                  </CardTitle>
                  <CardDescription>
                    Review and confirm your insurance policy details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <h3 className="font-medium text-slate-800">
                      Policy Summary
                    </h3>
                    <div className="mt-3 space-y-3 text-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                        <span className="text-slate-600">Insurance Type:</span>
                        <span className="font-medium text-slate-800">
                          {
                            insuranceTypes.find((t) => t.id === selectedType)
                              ?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                        <span className="text-slate-600">Plan:</span>
                        <span className="font-medium text-slate-800">
                          {
                            currentPlans.find((p) => p.id === selectedPlan)
                              ?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                        <span className="text-slate-600">Monthly Premium:</span>
                        <span className="font-medium text-blue-600">
                          {
                            currentPlans.find((p) => p.id === selectedPlan)
                              ?.price
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">
                          Coverage Start Date:
                        </span>
                        <span className="font-medium text-slate-800">
                          June 1, 2025
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-800">
                      Payment Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="card-name" className="text-slate-700">
                          Name on Card
                        </Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-number" className="text-slate-700">
                          Card Number
                        </Label>
                        <Input
                          id="card-number"
                          placeholder="•••• •••• •••• ••••"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="text-slate-700">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-slate-700">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="•••"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-800">
                      Billing Address
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-slate-700">
                          Street Address
                        </Label>
                        <Input
                          id="address"
                          placeholder="123 Main St"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-slate-700">
                          City
                        </Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-slate-700">
                          State
                        </Label>
                        <Select>
                          <SelectTrigger
                            id="state"
                            className="border-slate-300 focus:ring-blue-500"
                          >
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ny">New York</SelectItem>
                            <SelectItem value="ca">California</SelectItem>
                            <SelectItem value="tx">Texas</SelectItem>
                            <SelectItem value="fl">Florida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-slate-700">
                          ZIP Code
                        </Label>
                        <Input
                          id="zip"
                          placeholder="10001"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-slate-700">
                          Country
                        </Label>
                        <Select defaultValue="us">
                          <SelectTrigger
                            id="country"
                            className="border-slate-300 focus:ring-blue-500"
                          >
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                  >
                    {isLoading ? "Processing..." : "Complete Purchase"}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
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

export default function PurchasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PurchasePageContent />
    </Suspense>
  );
}
