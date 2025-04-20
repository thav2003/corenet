import React from "react";
import { WorkspaceNav } from "@/components/layout/WorkspaceNav";
import Image from "next/image";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFF]">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen w-64 border-r border-[#E8EFFF] bg-white shadow-[1px_0_2px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-[#E8EFFF]">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="CoreNet Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <h2 className="text-lg font-semibold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
                  CoreNet
                </h2>
              </div>
            </div>
            <WorkspaceNav />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="min-h-[calc(100vh-4rem)] p-6 bg-[#FAFBFF]">
            {children}
          </div>

          {/* Footer */}
          <footer className="h-16 border-t border-[#E8EFFF] bg-white shadow-[0_-1px_2px_rgba(0,0,0,0.05)]">
            <div className="h-full flex items-center justify-center">
              <span className="text-sm text-[#334155]">
                © 2025 CoreNet. All rights reserved.
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
