"use client";

import React, { useEffect, useState, useRef } from "react";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(
    mockTasks.find((t) => t.id === Number(taskId))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Resource usage data
  const [resourceData, setResourceData] = useState([
    { time: "00:00", gpu: 0, memory: 0, cpu: 0, network: 0, disk: 0 },
    { time: "00:01", gpu: 20, memory: 15, cpu: 25, network: 10, disk: 5 },
    { time: "00:02", gpu: 40, memory: 30, cpu: 45, network: 25, disk: 15 },
    { time: "00:03", gpu: 65, memory: 45, cpu: 60, network: 40, disk: 30 },
    { time: "00:04", gpu: 85, memory: 60, cpu: 80, network: 55, disk: 45 },
    { time: "00:05", gpu: 75, memory: 55, cpu: 70, network: 45, disk: 35 },
  ]);

  // Training metrics data
  const [trainingMetrics, setTrainingMetrics] = useState([
    { epoch: 1, loss: 2.5, accuracy: 0.3, val_loss: 2.3, val_accuracy: 0.32 },
    { epoch: 2, loss: 2.1, accuracy: 0.45, val_loss: 2.0, val_accuracy: 0.44 },
    { epoch: 3, loss: 1.8, accuracy: 0.55, val_loss: 1.7, val_accuracy: 0.54 },
    { epoch: 4, loss: 1.5, accuracy: 0.65, val_loss: 1.6, val_accuracy: 0.62 },
    { epoch: 5, loss: 1.2, accuracy: 0.75, val_loss: 1.3, val_accuracy: 0.72 },
  ]);

  // Add a ref for the logs container
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Add a useEffect to handle scrolling whenever logs change
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    // Load initial logs
    if (task?.details?.logs) {
      setLogs(task.details.logs);
    }
  }, [task?.details?.logs]);

  if (!task) {
    return (
      <div className="container mx-auto py-6">
        <Card className="bg-white border-red-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <CardHeader>
            <CardTitle className="text-red-500">Task Not Found</CardTitle>
            <CardDescription className="text-gray-600">
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
    try {
      setIsLoading(true);

      // Make POST request to start the task
      const response = await fetch("http://localhost:8000/training/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: taskId,
          type: task.type,
          model: task.model,
          dataset_path: task.details.dataset,
          model_name: task.model,
          gpuCount: task.details.gpuCount,
          vcpusPerGpu: task.details.vcpusPerGpu,
          ramPerGpu: task.details.ramPerGpu,
          diskSize: task.details.diskSize,
          trainingScript: task.details.trainingScript,
          dataset: task.details.dataset,
          pretrainedModel: task.details.pretrainedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start task: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Task started:", result);

      // Only update status to running after successful API call
      setTask((prev) => ({ ...prev!, status: "running" }));
    } catch (error: unknown) {
      console.error("Failed to start task:", error);
      setLogs((prev) => [
        ...prev,
        `Failed to start task: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      ]);
      // Keep the task in 'created' state so Run Task button remains visible
      setTask((prev) => ({ ...prev!, status: "created" }));
    } finally {
      setIsLoading(false);
    }
  };

  // Move SSE connection to useEffect
  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (task?.status === "running") {
      // Establish SSE connection to monitor progress
      eventSource = new EventSource(`http://localhost:8000/training/start`);

      // Handle pod creation events
      if (eventSource) {
        eventSource.addEventListener("create_pod", (e) => {
          console.log("Creating pod:", e.data);
          setLogs((prev) => [...prev, `Creating pod: ${e.data}`]);
        });

        eventSource.addEventListener("pod_created", (e) => {
          console.log("Pod created:", e.data);
          setLogs((prev) => [...prev, `Pod created: ${e.data}`]);
        });

        // Handle pod status updates
        eventSource.addEventListener("pod_status", (e) => {
          const data = JSON.parse(e.data);
          console.log("Pod status:", data);

          if (data.status) {
            setTask((prev) => ({
              ...prev!,
              status:
                data.status === "Running"
                  ? "running"
                  : data.status.toLowerCase(),
              progress: data.progress || prev!.progress,
              timeLeft: data.timeLeft || prev!.timeLeft,
            }));
          }

          // Update resource usage if available
          if (data.resources) {
            setResourceData((prev) => [
              ...prev.slice(-9),
              {
                time: new Date().toLocaleTimeString("en-US", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
                ...data.resources,
              },
            ]);
          }

          // Update training metrics if available
          if (data.metrics) {
            setTrainingMetrics((prev) => [...prev, data.metrics]);
          }
        });

        // Handle logs
        eventSource.addEventListener("log", (e) => {
          console.log("Pod log:", e.data);
          setLogs((prev) => [...prev, e.data]);
        });

        // Handle various error events
        ["create_pod", "get_pod_id", "pod_status", "unexpected"].forEach(
          (errorType) => {
            eventSource.addEventListener(errorType, (e) => {
              const data =
                typeof e.data === "string" ? e.data : JSON.stringify(e.data);
              if (data.includes("error")) {
                console.error(`${errorType} error:`, data);
                setLogs((prev) => [...prev, `Error (${errorType}): ${data}`]);

                // If it's a fatal error, reset to created state
                if (errorType === "unexpected" || data.includes("fatal")) {
                  eventSource.close();
                  setTask((prev) => ({ ...prev!, status: "created" }));
                }
              }
            });
          }
        );

        // Handle connection close
        eventSource.addEventListener("close", () => {
          console.log("SSE connection closed");
          eventSource.close();
        });

        // Handle general errors
        eventSource.onerror = (error: Event) => {
          console.error("SSE Error:", error);
          eventSource.close();
          setLogs((prev) => [
            ...prev,
            `Connection error: SSE connection failed`,
          ]);
          // Reset to created state on connection error
          setTask((prev) => ({ ...prev!, status: "created" }));
        };
      }
    }

    // Cleanup function to close SSE connection
    return () => {
      if (eventSource) {
        console.log("Cleaning up SSE connection");
        eventSource.close();
      }
    };
  }, [task?.status, taskId]); // Add dependencies

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
        <Card className="bg-white border-[#E8EFFF] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <CardHeader>
            <CardTitle className="text-lg text-[#334155]">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm text-[#64748B]">
              <span>Completion</span>
              <span>{task.progress}%</span>
            </div>
            <Progress
              value={task.progress}
              className="h-2 bg-[#F1F5F9] [&>div]:bg-gradient-to-r [&>div]:from-[#00FFA3] [&>div]:via-[#00E5FF] [&>div]:to-[#A374FF]"
            />
            <div className="text-sm text-[#64748B]">
              Time remaining: {task.timeLeft}
            </div>
            {task.details.startTime && (
              <div className="text-sm text-[#64748B]">
                Started: {new Date(task.details.startTime).toLocaleString()}
              </div>
            )}
            {task.details.endTime && (
              <div className="text-sm text-[#64748B]">
                Completed: {new Date(task.details.endTime).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E8EFFF] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <CardHeader>
            <CardTitle className="text-lg text-[#334155]">
              Task Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[#00E5FF]" />
              <span className="text-sm text-[#64748B]">Model:</span>
              <span className="text-sm text-[#334155]">{task.model}</span>
            </div>
            {task.type === "AI Training" && (
              <>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#00FFA3]" />
                  <span className="text-sm text-[#64748B]">Dataset:</span>
                  <span className="text-sm text-[#334155]">
                    {task.details.dataset} (
                    {task.details.datasetSize?.toLocaleString()} samples)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#A374FF]" />
                  <span className="text-sm text-[#64748B]">
                    Training Config:
                  </span>
                  <span className="text-sm text-[#334155]">
                    {task.details.epochs} epochs, batch {task.details.batchSize}
                    , lr {task.details.learningRate}
                  </span>
                </div>
              </>
            )}
            {task.type === "AI Predict" && task.details.prompt && (
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#00FFA3]" />
                <span className="text-sm text-[#64748B]">Prompt:</span>
                <span className="text-sm text-[#334155]">
                  {task.details.prompt}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resource Usage Card */}
        <Card className="bg-white border-[#E8EFFF] shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-[#334155]">
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resourceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EFFF" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E8EFFF",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#334155" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="gpu"
                    name="GPU Usage"
                    stroke="#A374FF"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    name="Memory Usage"
                    stroke="#00E5FF"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    name="CPU Usage"
                    stroke="#00FFA3"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="network"
                    name="Network I/O"
                    stroke="#FF6B6B"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="disk"
                    name="Disk I/O"
                    stroke="#FFD93D"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#A374FF]" />
                <span className="text-sm text-[#64748B]">GPU:</span>
                <span className="text-sm text-[#334155]">
                  {resourceData[resourceData.length - 1].gpu.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#00E5FF]" />
                <span className="text-sm text-[#64748B]">Memory:</span>
                <span className="text-sm text-[#334155]">
                  {resourceData[resourceData.length - 1].memory.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#00FFA3]" />
                <span className="text-sm text-[#64748B]">CPU:</span>
                <span className="text-sm text-[#334155]">
                  {resourceData[resourceData.length - 1].cpu.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#FF6B6B]" />
                <span className="text-sm text-[#64748B]">Network:</span>
                <span className="text-sm text-[#334155]">
                  {resourceData[resourceData.length - 1].network.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#FFD93D]" />
                <span className="text-sm text-[#64748B]">Disk:</span>
                <span className="text-sm text-[#334155]">
                  {resourceData[resourceData.length - 1].disk.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-[#00E5FF]" />
              <span className="text-sm text-[#64748B]">Cost:</span>
              <span className="text-sm text-[#334155]">
                {task.details.cost} SOL
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Training Metrics Card (only for AI Training tasks) */}
        {task.type === "AI Training" && (
          <Card className="bg-white border-[#E8EFFF] shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-[#334155]">
                Training Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8EFFF" />
                    <XAxis dataKey="epoch" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E8EFFF",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#334155" }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line
                      type="monotone"
                      dataKey="loss"
                      name="Training Loss"
                      stroke="#FF6B6B"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      name="Training Accuracy"
                      stroke="#00FFA3"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="val_loss"
                      name="Validation Loss"
                      stroke="#FFD93D"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="val_accuracy"
                      name="Validation Accuracy"
                      stroke="#00E5FF"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] p-4 rounded-lg">
                  <div className="text-sm text-[#64748B] mb-2">Training</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[#64748B]">Loss</div>
                      <div className="text-sm text-[#334155] font-medium">
                        {trainingMetrics[
                          trainingMetrics.length - 1
                        ].loss.toFixed(4)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#64748B]">Accuracy</div>
                      <div className="text-sm text-[#334155] font-medium">
                        {(
                          trainingMetrics[trainingMetrics.length - 1].accuracy *
                          100
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-lg">
                  <div className="text-sm text-[#64748B] mb-2">Validation</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[#64748B]">Loss</div>
                      <div className="text-sm text-[#334155] font-medium">
                        {trainingMetrics[
                          trainingMetrics.length - 1
                        ].val_loss.toFixed(4)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#64748B]">Accuracy</div>
                      <div className="text-sm text-[#334155] font-medium">
                        {(
                          trainingMetrics[trainingMetrics.length - 1]
                            .val_accuracy * 100
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Update logs container with class name for auto scroll */}
        {logs.length > 0 && (
          <Card className="bg-white border-[#E8EFFF] shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-[#334155]">
                <Terminal className="h-4 w-4" />
                Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={logsContainerRef}
                className="logs-container bg-[#F8FAFC] p-4 rounded-lg font-mono text-sm text-[#334155] h-[calc(100vh-32rem)] overflow-y-auto"
              >
                {logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <CardFooter className="flex justify-end gap-2">
        <ActionButton />
      </CardFooter>
    </div>
  );
}
