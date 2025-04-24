"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateTaskButton } from "@/components/CreateTaskButton";
import { cn } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";

interface Task {
  id: string;
  name: string;
  type: string;
  model?: string;
  status: string;
  createdAt: string;
  numGpus: number;
  vcpuPerGpu: number;
  ramPerGpu: number;
  diskSize: number;
  scriptPath?: string;
  wallet: {
    address: string;
  };
}

export default function TasksPage() {
  const { publicKey } = useWallet();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const walletAddress = publicKey?.toBase58() || "";

  const statusColors: Record<string, string> = {
    running: "text-[#00E5FF]",
    completed: "text-[#00FFA3]",
    pending: "text-[#A374FF]",
    failed: "text-red-500",
  };

  const statusIcons = {
    running: Loader2,
    completed: CheckCircle2,
    pending: Clock,
    failed: XCircle,
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`/api/tasks?wallet=${walletAddress}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchTasks();
    }
  }, [walletAddress, fetchTasks]);

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">My Tasks</h1>
          <CreateTaskButton onSuccess={fetchTasks} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            >
              <CardHeader>
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-[#1a2b44] rounded w-3/4"></div>
                  <div className="h-3 bg-[#1a2b44] rounded w-1/2"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-3">
                  <div className="h-3 bg-[#1a2b44] rounded w-full"></div>
                  <div className="h-8 bg-[#1a2b44] rounded w-1/4 ml-auto"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500">My Tasks</h1>
        <CreateTaskButton onSuccess={fetchTasks} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const StatusIcon =
            statusIcons[task.status as keyof typeof statusIcons] || Clock;
          return (
            <Card
              key={task.id}
              className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-gray-200">{task.name}</CardTitle>
                    <p className="text-sm text-gray-400">
                      {task.type === "AI Predict"
                        ? task.model
                        : "Training Task"}
                    </p>
                  </div>
                  <StatusIcon
                    className={cn(
                      "h-5 w-5",
                      statusColors[task.status] || "text-[#A374FF]",
                      task.status === "running" && "animate-spin"
                    )}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </span>
                    <span className="capitalize">{task.status}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Resources: {task.numGpus} GPU{task.numGpus > 1 ? "s" : ""} •{" "}
                    {task.vcpuPerGpu} vCPU • {task.ramPerGpu}GB RAM
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-[#0d2341] border-[#1a2b44] text-gray-400 hover:bg-[#1a2b44] hover:text-gray-200 hover:border-[#A374FF] flex items-center gap-1 transition-colors"
                      onClick={() => router.push(`/workspace/tasks/${task.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      Detail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
