"use client";

import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Access Denied</CardTitle>
          <CardDescription className="text-zinc-400">
            You are not authorized to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 text-sm mb-6">
            Only users with admin privileges can access this panel. 
            Please contact the system administrator if you believe this is an error.
          </p>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
