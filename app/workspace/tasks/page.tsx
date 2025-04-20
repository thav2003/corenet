"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockTasks, Task } from "../mockTasks";
import { CreateTaskButton } from "@/components/CreateTaskButton";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const [tasks] = useState<Task[]>(mockTasks);
  const router = useRouter();

  const statusColors: Record<string, string> = {
    running: "text-[#00E5FF]",
    completed: "text-[#00FFA3]",
    queued: "text-[#A374FF]",
    failed: "text-red-500",
    created: "text-[#A374FF]",
  };

  const statusIcons = {
    running: Loader2,
    completed: CheckCircle2,
    queued: Clock,
    failed: XCircle,
    created: Clock,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
          My Tasks
        </h1>
        <CreateTaskButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          return (
            <Card
              key={task.id}
              className="bg-white border-[#E8EFFF] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-[#334155]">
                      {task.name}
                    </CardTitle>
                    <p className="text-sm text-[#64748B]">{task.model}</p>
                  </div>
                  <StatusIcon
                    className={cn("h-5 w-5", statusColors[task.status])}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-[#64748B]">
                  <span>Date: {task.created}</span>
                  <span className="capitalize">{task.status}</span>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#E8EFFF] hover:border-[#A374FF] hover:bg-[#A374FF]/10 text-[#64748B] flex items-center gap-1"
                    onClick={() => router.push(`/workspace/tasks/${task.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
