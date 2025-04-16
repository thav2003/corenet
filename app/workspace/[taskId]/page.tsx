"use client";

import { useParams } from "next/navigation";
import { mockTasks } from "../mockTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Loader2, CheckCircle2, Clock, XCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = Number(params.taskId);
  const task = mockTasks.find((t) => t.id === taskId);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold text-white">Task not found</h1>
      </div>
    );
  }

  const statusColors = {
    running: "text-blue-500",
    completed: "text-green-500",
    queued: "text-yellow-500",
    failed: "text-red-500",
  };

  const StatusIcon = {
    running: Loader2,
    completed: CheckCircle2,
    queued: Clock,
    failed: XCircle,
  }[task.status];

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setPrompt("");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/workspace"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            {task.name}
          </h1>
          <p className="text-gray-400 text-sm">Task Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/50 border-[#A374FF]/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Task Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <div className="flex items-center gap-2">
                  <StatusIcon
                    className={cn(
                      "h-5 w-5",
                      statusColors[task.status],
                      task.status === "running" && "animate-spin"
                    )}
                  />
                  <span className={statusColors[task.status]}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Model</p>
                  <p className="text-white font-medium">{task.model}</p>
                </div>
                <div>
                  <p className="text-gray-400">Type</p>
                  <p className="text-white font-medium">{task.type}</p>
                </div>
                <div>
                  <p className="text-gray-400">Compute Units</p>
                  <p className="text-white font-medium">
                    {task.details.computeUnits} CU
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Memory</p>
                  <p className="text-white font-medium">
                    {task.details.memory} GB
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">GPU</p>
                  <p className="text-white font-medium">
                    {task.details.gpu ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Cost</p>
                  <p className="text-white font-medium">
                    ${task.details.cost.toFixed(2)}
                  </p>
                </div>
                {task.type === "AI Training" && (
                  <>
                    <div>
                      <p className="text-gray-400">Epochs</p>
                      <p className="text-white font-medium">
                        {task.details.epochs}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Batch Size</p>
                      <p className="text-white font-medium">
                        {task.details.batchSize}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Learning Rate</p>
                      <p className="text-white font-medium">
                        {task.details.learningRate}
                      </p>
                    </div>
                  </>
                )}
                {task.type === "AI Predict" && (
                  <>
                    <div>
                      <p className="text-gray-400">Dataset</p>
                      <p className="text-white font-medium">
                        {task.details.dataset}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Dataset Size</p>
                      <p className="text-white font-medium">
                        {task.details.datasetSize?.toLocaleString()} samples
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {task.type === "AI Predict" && (
            <Card className="bg-black/50 border-[#A374FF]/20">
              <CardHeader>
                <CardTitle className="text-lg text-white">Prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your prompt..."
                  className="bg-black/50 border-[#A374FF]/20 text-white min-h-[100px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button
                  className="w-full bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !prompt.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Run Prediction"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="bg-black/50 border-[#A374FF]/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {task.details.logs.map((log, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-300 font-mono bg-black/30 p-2 rounded"
                >
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
