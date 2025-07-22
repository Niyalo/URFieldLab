import { AuthProvider } from "@/app/contexts/AuthContext";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}