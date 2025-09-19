"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    role: "admin",
    subscription: "pro",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-2xl font-bold text-center">
          Create your account
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex-1">
                <Label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Full name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <Label
                  htmlFor="company"
                  className="block text-sm font-medium mb-1"
                >
                  Company name
                </Label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Company name"
                  required
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <Label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                style={{ background: "none", border: "none", padding: 0 }}
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="w-full text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
