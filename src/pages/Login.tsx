import React, { useState } from "react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { toast } from "@/hooks/use-toast";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup } = useAdminData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(username, password);
      if (success) {
        toast({ title: "Logged in successfully" });
      } else {
        toast({ title: "Invalid credentials", variant: "destructive" });
      }
    } else {
      const success = await signup(username, email, password);
      if (success) {
        toast({ title: "Account created successfully" });
      } else {
        toast({ title: "Signup failed", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card border border-border">
        <h2 className="text-3xl font-serif text-center mb-8">
          {isLogin ? "Admin Login" : "Admin Signup"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              required
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              required
            />
          </div>
          <button type="submit" className="luxury-button w-full py-4">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
