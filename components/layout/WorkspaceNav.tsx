"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  Cpu,
  Upload,
  ClipboardList,
  House,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function WorkspaceNav() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/workspace",
    },

    {
      title: "Upload Model",
      icon: <Upload className="h-5 w-5" />,
      href: "/workspace/upload",
    },
    {
      title: "Tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      href: "/workspace/tasks",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/workspace/settings",
    },
    {
      title: "Home",
      icon: <House className="h-5 w-5" />,
      href: "/",
    },
  ];

  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 hover:bg-transparent active:bg-transparent ${
                isActive
                  ? "bg-blue-50 text-blue-500 hover:bg-blue-50 hover:text-blue-500"
                  : "text-[#64748B] hover:bg-blue-50/50 hover:text-blue-500"
              }`}
            >
              {item.icon}
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
