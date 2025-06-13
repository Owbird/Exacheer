"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LineChart,
  LogOut,
  Settings,
  Sparkles,
  User2,
  Users,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { redirect, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getProfile } from "@/app/actions/user";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  const { user } = useUser();

  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const checkProfile = async () => {
    const profile = await getProfile(user?.id!);

    if (
      !profile?.institution ||
      !profile.programs ||
      profile.programs.length === 0
    ) {
      redirect(`/dashboard/profile`);
    }
  };

  React.useEffect(() => {
    if (user) {
      if (pathname.includes("/dashboard") && pathname != "/dashboard/profile") {
        checkProfile();
      }
    }
  }, [pathname, user]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-purple-600"></div>
            <span className="text-xl font-bold">
              Exacheer<span className="text-purple-600">AI</span>
            </span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="flex flex-col gap-2">
            {sidebarItems.map((item, index) => (
              <Button
                key={index}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "justify-start gap-3",
                  isActive(item.href) &&
                    "bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="Dr. Mensah"
              />
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Dr. Mensah</p>
              <p className="text-xs text-muted-foreground">Premium Plan</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 left-6 z-30 rounded-full shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </Button>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container py-6 md:py-8 max-w-7xl">{children}</div>
      </div>
    </div>
  );
}

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Create Exam",
    icon: FileText,
    href: "/dashboard/create-exam",
  },
  {
    label: "Question Bank",
    icon: BookOpen,
    href: "/dashboard/question-bank",
  },
  {
    label: "Profile",
    icon: User2,
    href: "/dashboard/profile",
  },
];
