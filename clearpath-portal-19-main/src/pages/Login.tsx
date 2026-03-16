import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select a role");
      return;
    }
    // Demo navigation based on role
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/proponent");
    }
    toast.success("Login successful");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </Link>
          <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to PARIVESH 3.0 Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Login As</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="proponent">Project Proponent / RQP</SelectItem>
                  <SelectItem value="scrutiny">Scrutiny Team</SelectItem>
                  <SelectItem value="mom">MoM Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">Register</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
