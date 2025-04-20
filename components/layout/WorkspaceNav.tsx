"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  Cpu,
  Upload,
  ClipboardList,
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
      title: "Compute",
      icon: <Cpu className="h-5 w-5" />,
      href: "/workspace/compute",
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
  ];

  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-[#00FFA3]/10 via-[#00E5FF]/10 to-[#A374FF]/10 text-[#00E5FF]"
                  : "text-[#64748B] hover:text-[#00E5FF] hover:bg-gradient-to-r hover:from-[#00FFA3]/5 hover:via-[#00E5FF]/5 hover:to-[#A374FF]/5"
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
