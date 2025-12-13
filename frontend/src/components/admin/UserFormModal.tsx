"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type UserFormValues = {
  username?: string;
  isActive?: boolean;
  role?: "CUSTOMER" | "ADMIN" | "MODERATOR";
};

export function UserFormModal({
  open,
  userEmail,
  initialValues,
  loading,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  userEmail?: string;
  initialValues?: UserFormValues;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserFormValues["role"]>("CUSTOMER");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setUsername(initialValues?.username ?? "");
    setRole((initialValues?.role ?? "CUSTOMER") as any);
    setIsActive(initialValues?.isActive ?? true);
  }, [open, initialValues]);

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (username && username.trim().length < 2) errs.username = "Username must be at least 2 characters.";
    return errs;
  }, [username]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900">Edit User</DialogTitle>
          <DialogDescription className="text-gray-500">
            {userEmail ? `Editing user: ${userEmail}` : "Update user details below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!!loading}
              placeholder="e.g. johndoe"
              className="h-11"
            />
            {errors.username ? <p className="text-sm text-red-600 font-medium">{errors.username}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Role</Label>
            <div className="relative">
              <select
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                disabled={!!loading}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="MODERATOR">Moderator</option>
                <option value="ADMIN">Admin</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                   <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <input
              id="isActive"
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600 border-gray-300"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={!!loading}
            />
            <Label htmlFor="isActive" className="text-gray-900 font-medium cursor-pointer">Active User</Label>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={!!loading} className="text-gray-600">
            Cancel
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={() =>
              onSubmit({
                username: username.trim() || undefined,
                role,
                isActive,
              })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


