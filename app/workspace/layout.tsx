import React from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  Code2,
  Database,
  Network,
  Cpu,
} from "lucide-react";
import Link from "next/link";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
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
      title: "Network",
      icon: <Network className="h-5 w-5" />,
      href: "/workspace/network",
    },
    {
      title: "Database",
      icon: <Database className="h-5 w-5" />,
      href: "/workspace/database",
    },
    {
      title: "Code",
      icon: <Code2 className="h-5 w-5" />,
      href: "/workspace/code",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/workspace/settings",
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#A374FF]/20 bg-black/95">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
              Workspace
            </h2>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-gray-400 hover:text-[#A374FF] hover:bg-[#A374FF]/10 data-[active=true]:bg-[#A374FF]/10 data-[active=true]:text-[#A374FF]"
                  data-active={item.href === "/workspace"}
                >
                  {item.icon}
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-black/95">
        <div className="h-full p-6">{children}</div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
