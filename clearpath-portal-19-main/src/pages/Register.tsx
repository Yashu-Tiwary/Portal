import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </Link>
          <CardTitle className="font-display text-2xl">Create Account</CardTitle>
          <CardDescription>Register as a Project Proponent or RQP</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Doe" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label>Organization</Label>
              <Input placeholder="Your organization name" required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">Create Account</Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Sign In</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
