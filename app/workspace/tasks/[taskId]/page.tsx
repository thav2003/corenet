"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Coins,
  Terminal,
  Brain,
  Database,
} from "lucide-react";
import { mockTasks } from "../../mockTasks";
import { CreateTaskButton } from "../../../../components/CreateTaskButton";

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const task = mockTasks.find((t) => t.id === Number(taskId));

  if (!task) {
    return (
      <div className="container mx-auto py-6">
        <Card className="bg-red-900/20 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Task Not Found</CardTitle>
            <CardDescription>
              The requested task could not be found.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-[#00E5FF]" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-[#00FFA3]" />;
      case "queued":
        return <AlertCircle className="h-4 w-4 text-[#A374FF]" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            {task.name}
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-300 text-sm">{task.type}</p>
            <div
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                task.mode === "prediction"
                  ? "bg-[#00FFA3]/20 text-[#00FFA3]"
                  : "bg-[#A374FF]/20 text-[#A374FF]"
              }`}
            >
              <Brain className="h-4 w-4" />
              <span className="capitalize">{task.mode}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
              task.status === "running"
                ? "bg-[#00E5FF]/20 text-[#00E5FF]"
                : task.status === "completed"
                ? "bg-[#00FFA3]/20 text-[#00FFA3]"
                : "bg-[#A374FF]/20 text-[#A374FF]"
            }`}
          >
            {getStatusIcon(task.status)}
            <span className="capitalize">{task.status}</span>
          </div>
          <CreateTaskButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/50 border-[#A374FF]/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Completion</span>
              <span>{task.progress}%</span>
            </div>
            <Progress
              value={task.progress}
              className="h-2 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-[#00FFA3] [&>div]:via-[#00E5FF] [&>div]:to-[#A374FF]"
            />
            <div className="text-sm text-gray-300">
              Time remaining: {task.timeLeft}
            </div>
            {task.details.startTime && (
              <div className="text-sm text-gray-300">
                Started: {new Date(task.details.startTime).toLocaleString()}
              </div>
            )}
            {task.details.endTime && (
              <div className="text-sm text-gray-300">
                Completed: {new Date(task.details.endTime).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-[#A374FF]/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[#00E5FF]" />
              <span className="text-sm text-gray-300">Model:</span>
              <span className="text-sm text-white">{task.details.model}</span>
            </div>
            {task.details.dataset && (
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-[#00FFA3]" />
                <span className="text-sm text-gray-300">Dataset:</span>
                <span className="text-sm text-white">
                  {task.details.dataset}
                </span>
              </div>
            )}
            {task.details.epochs && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#A374FF]" />
                <span className="text-sm text-gray-300">Epochs:</span>
                <span className="text-sm text-white">
                  {task.details.epochs}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-[#A374FF]/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Resource Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#00E5FF]" />
              <span className="text-sm text-gray-300">Compute Units:</span>
              <span className="text-sm text-white">
                {task.details.computeUnits}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#00FFA3]" />
              <span className="text-sm text-gray-300">Memory:</span>
              <span className="text-sm text-white">
                {task.details.memory}GB
              </span>
            </div>
            {task.details.gpu && (
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#A374FF]" />
                <span className="text-sm text-gray-300">GPU Enabled</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-[#00E5FF]" />
              <span className="text-sm text-gray-300">Cost:</span>
              <span className="text-sm text-white">
                {task.details.cost} SOL
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {task.details?.logs && (
        <Card className="bg-black/50 border-[#A374FF]/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Terminal className="h-4 w-4" />
              Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-gray-300 h-64 overflow-y-auto">
              {task.details.logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          className="border-[#A374FF]/20 hover:border-[#A374FF] hover:bg-[#A374FF]/10 text-gray-300"
        >
          Cancel Task
        </Button>
        <Button className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90">
          Download Results
        </Button>
      </CardFooter>
    </div>
  );
}
