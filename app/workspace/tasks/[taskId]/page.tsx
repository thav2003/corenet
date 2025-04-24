"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  CheckCircle2,
  Cpu,
  Brain,
  Terminal,
  Play,
  XCircle,
  Download,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

interface Task {
  id: string;
  name: string;
  type: string;
  numGpus: number;
  vcpuPerGpu: number;
  ramPerGpu: number;
  diskSize: number;
  model?: string;
  scriptPath?: string;
  installCommand?: string;
  runCommand?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourceUsage {
  time: string;
  gpu: number;
  memory: number;
  cpu: number;
}

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const router = useRouter();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [promptInput, setPromptInput] = useState("");
  const [imageConfig, setImageConfig] = useState({
    width: 512,
    height: 512,
    steps: 30,
    guidance_scale: 7.5,
    negative_prompt: "",
  });
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);

  // Resource usage data
  const [resourceData, setResourceData] = useState<ResourceUsage[]>([
    { time: new Date().toLocaleTimeString(), gpu: 0, memory: 0, cpu: 0 },
  ]);

  // Add a ref for the logs container
  const logsContainerRef = React.useRef<HTMLDivElement>(null);

  // Add a useEffect to handle scrolling whenever logs change
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const fetchTaskDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch task details");
      }
      const data = await response.json();
      setTask(data);
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId, fetchTaskDetails]);

  // Effect for SSE connection
  useEffect(() => {
    let eventSource: EventSource | null = null;

    // Set up SSE connection to listen for updates
    eventSource = new EventSource(`/api/runtask/${taskId}`);

    eventSource.onmessage = (event) => {
      console.log("Event:", event);
      const data = JSON.parse(event.data);

      if (data.type === "resource") {
        setResourceData((prev) => {
          const newData = [...prev, data.data];
          return newData.slice(-10);
        });
      }

      if (data.type === "log") {
        setLogs((prev) => [...prev, data.data]);
      }

      if (data.type === "done") {
        eventSource?.close();
        fetchTaskDetails();
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource?.close();

      setLogs((prev) => [...prev, "Error: Connection to server lost"]);
    };

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [taskId]);

  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Add useEffect for chat auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card className="bg-white border-[#E8EFFF] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <CardHeader>
            <CardTitle className="text-[#334155]">Loading...</CardTitle>
            <CardDescription className="text-[#64748B]">
              Fetching task details...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#A374FF]" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardFooter>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="text-[#64748B]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const statusIcon = {
    pending: <Clock className="h-4 w-4 text-yellow-500" />,
    running: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    failed: <XCircle className="h-4 w-4 text-red-500" />,
  }[task.status.toLowerCase()];

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
    if (!task || !wallet.publicKey || !wallet.signTransaction) {
      setLogs((prev) => [...prev, "Error: Please connect your wallet first"]);
      return;
    }

    try {
      setLogs((prev) => [...prev, "Initiating SOL transfer..."]);

      // Create transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(process.env.NEXT_PUBLIC_RECEIVE_WALLET || ""), // Task wallet address
          lamports: LAMPORTS_PER_SOL * 0.05, // 0.1 SOL for example, adjust as needed
        })
      );

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      // Sign and send transaction
      const signed = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      setLogs((prev) => [...prev, `SOL transfer successful: ${signature}`]);

      // Proceed with running the task
      const response = await fetch(`/api/runtask/${task.id}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to start task");
      }
      const data = await response.json();
      setTask(data.task);
    } catch (error) {
      console.error("Failed to run task:", error);
      setLogs((prev) => [
        ...prev,
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ]);
    }
  };

  const handleCancelTask = async () => {
    if (!task) return;

    try {
      setLogs((prev) => [...prev, "[System] Cancelling task..."]);

      const response = await fetch(`/api/runtask/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel task");
      }

      const data = await response.json();
      setTask(data.task);
      setLogs((prev) => [...prev, "[System] Task cancelled successfully"]);
    } catch (error) {
      console.error("Failed to cancel task:", error);
      setLogs((prev) => [
        ...prev,
        `Error: ${
          error instanceof Error ? error.message : "Failed to cancel task"
        }`,
      ]);
    }
  };

  const handleDownloadResult = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const renderPredictionInterface = () => {
    if (task.type !== "AI Predict") return null;

    const modelType = task.model?.toLowerCase() || "";
    const isImageModel =
      modelType.includes("stable") || modelType.includes("dall-e");
    const isChatModel =
      modelType.includes("gpt") || modelType.includes("llama");

    if (isImageModel) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-[#64748B]">Image Prompt</label>
            <Textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="w-full h-32 bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] placeholder-[#64748B]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-[#64748B]">Width</label>
              <input
                type="number"
                value={imageConfig.width}
                onChange={(e) =>
                  setImageConfig({
                    ...imageConfig,
                    width: Number(e.target.value),
                  })
                }
                className="w-full p-2 bg-[#F8FAFC] border border-[#E8EFFF] rounded-md text-[#334155]"
                step={64}
                min={256}
                max={1024}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#64748B]">Height</label>
              <input
                type="number"
                value={imageConfig.height}
                onChange={(e) =>
                  setImageConfig({
                    ...imageConfig,
                    height: Number(e.target.value),
                  })
                }
                className="w-full p-2 bg-[#F8FAFC] border border-[#E8EFFF] rounded-md text-[#334155]"
                step={64}
                min={256}
                max={1024}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#64748B]">Steps</label>
              <input
                type="number"
                value={imageConfig.steps}
                onChange={(e) =>
                  setImageConfig({
                    ...imageConfig,
                    steps: Number(e.target.value),
                  })
                }
                className="w-full p-2 bg-[#F8FAFC] border border-[#E8EFFF] rounded-md text-[#334155]"
                min={10}
                max={150}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#64748B]">Guidance Scale</label>
              <input
                type="number"
                value={imageConfig.guidance_scale}
                onChange={(e) =>
                  setImageConfig({
                    ...imageConfig,
                    guidance_scale: Number(e.target.value),
                  })
                }
                className="w-full p-2 bg-[#F8FAFC] border border-[#E8EFFF] rounded-md text-[#334155]"
                step={0.5}
                min={1}
                max={20}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#64748B]">Negative Prompt</label>
            <Textarea
              value={imageConfig.negative_prompt}
              onChange={(e) =>
                setImageConfig({
                  ...imageConfig,
                  negative_prompt: e.target.value,
                })
              }
              placeholder="What to avoid in the generated image..."
              className="w-full h-20 bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] placeholder-[#64748B]"
            />
          </div>
        </div>
      );
    }

    if (isChatModel) {
      return (
        <div className="space-y-4">
          <div
            ref={chatContainerRef}
            className="bg-[#F8FAFC] rounded-lg p-4 h-[300px] overflow-y-auto space-y-4 scroll-smooth"
          >
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-[#A374FF] text-white"
                      : "bg-white border border-[#E8EFFF] text-[#334155]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] placeholder-[#64748B]"
            />
            <Button
              onClick={() => {
                if (!promptInput.trim()) return;
                setChatMessages((prev) => [
                  ...prev,
                  { role: "user", content: promptInput },
                ]);
                setPromptInput("");
                handleRunTask();
              }}
              className="bg-[#A374FF] text-white transition-colors hover:bg-[#B68FFF]"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Default text prompt interface
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-[#64748B]">Prompt</label>
          <Textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full h-32 bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] placeholder-[#64748B]"
          />
        </div>
      </div>
    );
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
        if (task.type === "AI Predict") {
          return (
            <div className="w-full space-y-4">
              {renderPredictionInterface()}
              <Button
                onClick={handleRunTask}
                disabled={!promptInput.trim()}
                className="w-full bg-[#A374FF] text-white transition-colors hover:bg-[#B68FFF]"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Prediction
              </Button>
            </div>
          );
        }
        return (
          <Button
            onClick={handleRunTask}
            className="w-full bg-[#A374FF] text-white transition-colors hover:bg-[#B68FFF]"
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
        return (
          <Button
            onClick={handleDownloadResult}
            className="w-full bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Result
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="p-0 hover:bg-transparent"
            >
              <ArrowLeft className="h-5 w-5 text-[#64748B]" />
            </Button>
            <h1 className="text-2xl font-bold text-blue-500">{task.name}</h1>
          </div>
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
            {statusIcon}
            <span className="capitalize">{task.status}</span>
          </div>
          <CreateTaskButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">
              Task Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Name:</span>
                <span className="font-medium text-gray-200">{task.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Type:</span>
                <span className="font-medium text-gray-200">{task.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status:</span>
                <span className="font-medium text-gray-200">{task.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Created:</span>
                <span className="font-medium text-gray-200">
                  {task.createdAt}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">Resources</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0d2341] p-3 rounded-lg">
                  <p className="text-sm text-gray-400">GPUs</p>
                  <p className="text-gray-200 font-medium">{task.numGpus}</p>
                </div>
                <div className="bg-[#0d2341] p-3 rounded-lg">
                  <p className="text-sm text-gray-400">vCPU/GPU</p>
                  <p className="text-gray-200 font-medium">{task.vcpuPerGpu}</p>
                </div>
                <div className="bg-[#0d2341] p-3 rounded-lg">
                  <p className="text-sm text-gray-400">RAM/GPU</p>
                  <p className="text-gray-200 font-medium">
                    {task.ramPerGpu}GB
                  </p>
                </div>
              </div>
            </div>

            {task.type === "AI Training" && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Training Configuration</p>
                <div className="bg-[#0d2341] p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Script Path</p>
                    <p className="text-gray-200 font-mono text-sm">
                      {task.scriptPath}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Install Command</p>
                    <p className="text-gray-200 font-mono text-sm">
                      {task.installCommand}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Run Command</p>
                    <p className="text-gray-200 font-mono text-sm">
                      {task.runCommand}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {task.type === "AI Predict" && task.model && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Model</p>
                <div className="bg-[#0d2341] p-3 rounded-lg">
                  <p className="text-gray-200 font-medium">{task.model}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">
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
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)] md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-200">
                <Terminal className="h-4 w-4" />
                Task Logs
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={logsContainerRef}
              className="bg-[#0d2341] p-4 rounded-lg font-mono text-sm text-gray-200 h-[300px] overflow-y-auto"
            >
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap mb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">
                  No logs available. Run the task to see output here.
                </div>
              )}
            </div>
            <div className="mt-4">
              <ActionButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
