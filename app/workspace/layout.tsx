import React from "react";
import { WorkspaceNav } from "@/components/layout/WorkspaceNav";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
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
          <WorkspaceNav />
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
