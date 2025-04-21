"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  Cpu,
  Upload,
  ClipboardList,
  House 
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
    {
      title: "Home",
      icon: <House className="h-5 w-5" />,
      href: "/",
    },
  ];

  return (
    <nav className="flex-1 px-2 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-400 hover:text-[#A374FF] hover:bg-[#A374FF]/10 data-[active=true]:bg-[#A374FF]/10 data-[active=true]:text-[#A374FF]"
              data-active={isActive}
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
