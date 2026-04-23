"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function AdminSignOutButton() {
  return (
    <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/login" })}>
      Sign out
    </Button>
  );
}
