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
  Cpu,
  Coins,
  Terminal,
  Brain,
  Database,
  Play,
  XCircle,
  Download,
  Loader2,
} from "lucide-react";
import { mockTasks } from "../../mockTasks";
import { CreateTaskButton } from "../../../../components/CreateTaskButton";

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const task = mockTasks.find((t) => t.id === Number(taskId));
  const [isLoading, setIsLoading] = React.useState(false);

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
      case "created":
        return <Clock className="h-4 w-4 text-[#A374FF]" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-[#00E5FF] animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-[#00FFA3]" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "created":
        return "bg-[#A374FF]/20 text-[#A374FF]";
      case "running":
        return "bg-[#00E5FF]/20 text-[#00E5FF]";
      case "completed":
        return "bg-[#00FFA3]/20 text-[#00FFA3]";
      case "failed":
        return "bg-red-500/20 text-red-500";
      default:
        return "";
    }
  };

  const handleRunTask = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleCancelTask = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleDownloadResult = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const ActionButton = () => {
    if (isLoading) {
      return (
        <Button disabled className="w-full">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </Button>
      );
    }

    switch (task.status) {
      case "created":
        return (
          <Button
            onClick={handleRunTask}
            className="w-full bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90"
          >
            <Play className="h-4 w-4 mr-2" />
            Run Task
          </Button>
        );
      case "running":
        return (
          <Button
            onClick={handleCancelTask}
            variant="destructive"
            className="w-full"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel Task
          </Button>
        );
      case "completed":
        return task.details.result ? (
          <Button
            onClick={handleDownloadResult}
            className="w-full bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Result
          </Button>
        ) : null;
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
            <div
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                task.type === "AI Predict"
                  ? "bg-[#00FFA3]/20 text-[#00FFA3]"
                  : "bg-[#A374FF]/20 text-[#A374FF]"
              }`}
            >
              <Brain className="h-4 w-4" />
              <span className="capitalize">{task.type}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(
              task.status
            )}`}
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
              <span className="text-sm text-white">{task.model}</span>
            </div>
            {task.type === "AI Training" && (
              <>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#00FFA3]" />
                  <span className="text-sm text-gray-300">Dataset:</span>
                  <span className="text-sm text-white">
                    {task.details.dataset} (
                    {task.details.datasetSize?.toLocaleString()} samples)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#A374FF]" />
                  <span className="text-sm text-gray-300">
                    Training Config:
                  </span>
                  <span className="text-sm text-white">
                    {task.details.epochs} epochs, batch {task.details.batchSize}
                    , lr {task.details.learningRate}
                  </span>
                </div>
              </>
            )}
            {task.type === "AI Predict" && task.details.prompt && (
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#00FFA3]" />
                <span className="text-sm text-gray-300">Prompt:</span>
                <span className="text-sm text-white">
                  {task.details.prompt}
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
        <ActionButton />
      </CardFooter>
    </div>
  );
}
