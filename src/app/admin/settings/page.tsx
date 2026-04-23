"use client";

import { useEffect, useState } from "react";
import { AboutEditor } from "@/components/admin/editors/AboutEditor";
import { ContactEditor } from "@/components/admin/editors/ContactEditor";
import { HeroEditor } from "@/components/admin/editors/HeroEditor";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ActivityItem {
  _id: string;
  action: string;
  target: string;
  actorEmail: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export default function AdminSettingsPage() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    fetch("/api/activity", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setActivity(Array.isArray(data) ? data : []))
      .catch(() => setActivity([]));
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    setPasswordLoading(true);

    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm)
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Failed to change password");
        return;
      }

      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPasswordError("An error occurred");
    } finally {
      setPasswordLoading(false);
    }
  };

  const envChecks = [
    ["MongoDB URI", "Add MONGODB_URI in .env.local and Vercel"],
    ["GitHub OAuth", "Set GITHUB_ID and GITHUB_SECRET"],
    ["NextAuth Secret", "Set NEXTAUTH_SECRET for secure sessions"]
  ];

  return (
    <div className="space-y-6">
      <HeroEditor />
      <AboutEditor />
      <ContactEditor />

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          {passwordError && (
            <div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-400">
              Password changed successfully
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Current Password
            </label>
            <Input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              placeholder="Confirm new password"
              required
            />
          </div>
          <Button type="submit" disabled={passwordLoading}>
            {passwordLoading ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold">Environment checklist</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {envChecks.map(([label, note]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-2 font-semibold text-emerald-600">{note}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Use this section to review content settings and recent admin changes.
          Environment values themselves stay private and are never displayed here.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold">Recent activity</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity yet.</p>
        ) : (
          <div className="space-y-3">
            {activity.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold capitalize">
                      {item.action} {item.target}
                    </div>
                    <div className="text-sm text-slate-500">{item.actorEmail}</div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}