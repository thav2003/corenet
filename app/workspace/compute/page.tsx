"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Brain,
  Shield,
  Zap,
  Database,
  Gauge,
  BarChart3,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Pause,
  Trash2,
  Download,
  Share2,
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Types
interface ComputeTask {
  id: number;
  name: string;
  type: string;
  status: "running" | "completed" | "queued" | "failed";
  progress: number;
  computeUnits: number;
  memory: number;
  gpu: boolean;
  startTime: string | null;
  estimatedEndTime: string | null;
}

interface ComputeResource {
  total: number;
  used: number;
  tasks: number;
  type: string;
  description: string;
  features: string[];
  history: { time: string; value: number }[];
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

interface ResourceCardProps {
  resource: ComputeResource;
  type: string;
}

// Mock data for compute resources
const computeResources = {
  aiCompute: {
    total: 1000,
    used: 650,
    tasks: 12,
    type: "AI Compute",
    description: "GPU-accelerated AI model training and inference",
    features: [
      "Distributed model training",
      "Real-time inference",
      "Model optimization",
      "Custom model deployment",
    ],
    history: [
      { time: "00:00", value: 620 },
      { time: "04:00", value: 580 },
      { time: "08:00", value: 640 },
      { time: "12:00", value: 650 },
      { time: "16:00", value: 630 },
      { time: "20:00", value: 650 },
    ],
  },
  zkCompute: {
    total: 500,
    used: 320,
    tasks: 8,
    type: "ZK Compute",
    description: "Zero-knowledge proof generation and verification",
    features: [
      "ZK circuit compilation",
      "Proof generation",
      "Proof verification",
      "Custom ZK protocols",
    ],
    history: [
      { time: "00:00", value: 300 },
      { time: "04:00", value: 280 },
      { time: "08:00", value: 310 },
      { time: "12:00", value: 320 },
      { time: "16:00", value: 300 },
      { time: "20:00", value: 320 },
    ],
  },
  mevOptimization: {
    total: 300,
    used: 180,
    tasks: 5,
    type: "MEV Optimization",
    description: "Maximal Extractable Value optimization and extraction",
    features: [
      "Arbitrage detection",
      "Sandwich trading",
      "Frontrunning protection",
      "MEV strategy execution",
    ],
    history: [
      { time: "00:00", value: 170 },
      { time: "04:00", value: 160 },
      { time: "08:00", value: 175 },
      { time: "12:00", value: 180 },
      { time: "16:00", value: 170 },
      { time: "20:00", value: 180 },
    ],
  },
  dataProcessing: {
    total: 800,
    used: 450,
    tasks: 15,
    type: "Data Processing",
    description: "Blockchain data analysis and processing",
    features: [
      "Transaction analysis",
      "Pattern recognition",
      "Data indexing",
      "Real-time analytics",
    ],
    history: [
      { time: "00:00", value: 420 },
      { time: "04:00", value: 400 },
      { time: "08:00", value: 440 },
      { time: "12:00", value: 450 },
      { time: "16:00", value: 430 },
      { time: "20:00", value: 450 },
    ],
  },
};

// Mock data for active tasks
const activeTasks: ComputeTask[] = [
  {
    id: 1,
    name: "LLM Training",
    type: "AI Compute",
    status: "running",
    progress: 65,
    computeUnits: 500,
    memory: 16,
    gpu: true,
    startTime: "2023-06-15T10:30:00Z",
    estimatedEndTime: "2023-06-16T02:30:00Z",
  },
  {
    id: 2,
    name: "ZK Proof Generation",
    type: "ZK Compute",
    status: "running",
    progress: 42,
    computeUnits: 300,
    memory: 8,
    gpu: true,
    startTime: "2023-06-15T11:45:00Z",
    estimatedEndTime: "2023-06-15T23:45:00Z",
  },
  {
    id: 3,
    name: "MEV Extraction",
    type: "MEV Optimization",
    status: "running",
    progress: 78,
    computeUnits: 150,
    memory: 4,
    gpu: false,
    startTime: "2023-06-15T09:15:00Z",
    estimatedEndTime: "2023-06-15T21:15:00Z",
  },
  {
    id: 4,
    name: "Blockchain Data Analysis",
    type: "Data Processing",
    status: "running",
    progress: 23,
    computeUnits: 400,
    memory: 12,
    gpu: false,
    startTime: "2023-06-15T13:20:00Z",
    estimatedEndTime: "2023-06-16T01:20:00Z",
  },
  {
    id: 5,
    name: "Image Generation",
    type: "AI Compute",
    status: "queued",
    progress: 0,
    computeUnits: 200,
    memory: 6,
    gpu: true,
    startTime: null,
    estimatedEndTime: null,
  },
  {
    id: 6,
    name: "Text Classification",
    type: "AI Compute",
    status: "queued",
    progress: 0,
    computeUnits: 150,
    memory: 4,
    gpu: false,
    startTime: null,
    estimatedEndTime: null,
  },
  {
    id: 7,
    name: "Verification",
    type: "ZK Compute",
    status: "queued",
    progress: 0,
    computeUnits: 100,
    memory: 3,
    gpu: false,
    startTime: null,
    estimatedEndTime: null,
  },
  {
    id: 8,
    name: "Arbitrage Detection",
    type: "MEV Optimization",
    status: "queued",
    progress: 0,
    computeUnits: 80,
    memory: 2,
    gpu: false,
    startTime: null,
    estimatedEndTime: null,
  },
  {
    id: 9,
    name: "Transaction Pattern Recognition",
    type: "Data Processing",
    status: "queued",
    progress: 0,
    computeUnits: 250,
    memory: 8,
    gpu: false,
    startTime: null,
    estimatedEndTime: null,
  },
];

export default function ComputePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<ComputeResource | null>(null);
  const [resourceAllocation, setResourceAllocation] = useState(0);

  // Filter and sort tasks
  const filteredTasks = activeTasks
    .filter((task) => {
      const matchesSearch = task.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" ||
        task.type.toLowerCase() === filterType.toLowerCase();
      const matchesStatus =
        filterStatus === "all" ||
        task.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "progress") {
        return sortDirection === "asc"
          ? a.progress - b.progress
          : b.progress - a.progress;
      } else if (sortField === "computeUnits") {
        return sortDirection === "asc"
          ? a.computeUnits - b.computeUnits
          : b.computeUnits - a.computeUnits;
      } else if (sortField === "startTime") {
        if (!a.startTime) return sortDirection === "asc" ? 1 : -1;
        if (!b.startTime) return sortDirection === "asc" ? -1 : 1;
        return sortDirection === "asc"
          ? new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          : new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-[#00E5FF]/20 text-[#00E5FF]";
      case "completed":
        return "bg-[#00FFA3]/20 text-[#00FFA3]";
      case "queued":
        return "bg-[#A374FF]/20 text-[#A374FF]";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not started";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const ResourceCard = ({ resource, type }: ResourceCardProps) => {
    const usagePercentage = (resource.used / resource.total) * 100;
    const getIcon = (type: string) => {
      switch (type) {
        case "aiCompute":
          return <Brain className="h-6 w-6 text-[#00E5FF]" />;
        case "zkCompute":
          return <Shield className="h-6 w-6 text-[#00FFA3]" />;
        case "mevOptimization":
          return <Zap className="h-6 w-6 text-[#A374FF]" />;
        case "dataProcessing":
          return <Database className="h-6 w-6 text-[#00E5FF]" />;
        default:
          return <Cpu className="h-6 w-6 text-[#00E5FF]" />;
      }
    };

    return (
      <Card className="bg-black/50 border-[#A374FF]/20 hover:border-[#A374FF]/40 transition-all">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getIcon(type)}
              <CardTitle className="text-lg text-white">
                {resource.type}
              </CardTitle>
            </div>
            <div className="p-2 rounded-full bg-gradient-to-r from-[#00FFA3]/10 via-[#00E5FF]/10 to-[#A374FF]/10">
              <Gauge className="h-4 w-4 text-[#00E5FF]" />
            </div>
          </div>
          <CardDescription className="text-gray-300">
            {resource.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Resource Usage</span>
              <span>{usagePercentage.toFixed(1)}%</span>
            </div>
            <Progress
              value={usagePercentage}
              className="h-2 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-[#00FFA3] [&>div]:via-[#00E5FF] [&>div]:to-[#A374FF]"
            />
            <div className="flex justify-between text-sm text-gray-300">
              <span>Used: {resource.used} CU</span>
              <span>Total: {resource.total} CU</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-300">
              Active Tasks: {resource.tasks}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {resource.features.map((feature, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-300 bg-black/30 p-2 rounded-lg"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            className="border-[#A374FF]/20 hover:border-[#A374FF] hover:bg-[#A374FF]/10 text-gray-300"
            onClick={() => {
              setSelectedResource(resource);
              setResourceAllocation(resource.used);
              setIsResourceDialogOpen(true);
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
          <Button
            className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90"
            onClick={() => router.push(`/workspace/compute/${type}`)}
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
    <Card className="bg-black/50 border-[#A374FF]/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-gray-300">
            {title}
          </CardTitle>
          <div className="p-2 rounded-full bg-gradient-to-r from-[#00FFA3]/10 via-[#00E5FF]/10 to-[#A374FF]/10">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
          {value}
        </div>
        <p className="text-xs text-gray-300 mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  const ResourceChart = ({ resource }: { resource: ComputeResource }) => {
    const maxValue = Math.max(...resource.history.map((h) => h.value));
    const chartHeight = 100;

    return (
      <div className="h-[120px] flex items-end gap-1">
        {resource.history.map((point, index) => {
          const height = (point.value / maxValue) * chartHeight;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-[#00FFA3] via-[#00E5FF] to-[#A374FF] rounded-t-sm"
                style={{ height: `${height}px` }}
              ></div>
              <div className="text-xs text-gray-400 mt-1">{point.time}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const TaskRow = ({ task }: { task: ComputeTask }) => {
    return (
      <TableRow
        className="cursor-pointer hover:bg-black/30"
        onClick={() => router.push(`/workspace/${task.id}`)}
      >
        <TableCell className="font-medium text-white">{task.name}</TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={`${getStatusColor(task.status)} border-0`}
          >
            {getStatusIcon(task.status)}
            <span className="ml-1 capitalize">{task.status}</span>
          </Badge>
        </TableCell>
        <TableCell>{task.type}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Progress
              value={task.progress}
              className="h-1 w-20 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-[#00FFA3] [&>div]:via-[#00E5FF] [&>div]:to-[#A374FF]"
            />
            <span className="text-xs text-gray-300">{task.progress}%</span>
          </div>
        </TableCell>
        <TableCell>{task.computeUnits} CU</TableCell>
        <TableCell>{task.memory} GB</TableCell>
        <TableCell>{task.gpu ? "Yes" : "No"}</TableCell>
        <TableCell className="text-gray-300">
          {formatDate(task.startTime)}
        </TableCell>
        <TableCell className="text-gray-300">
          {formatDate(task.estimatedEndTime)}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-300 hover:text-white"
              >
                <span className="sr-only">Open menu</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-black/90 border-[#A374FF]/20"
            >
              <DropdownMenuItem
                className="text-gray-300 hover:text-white hover:bg-[#A374FF]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/workspace/${task.id}`);
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-gray-300 hover:text-white hover:bg-[#A374FF]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Pause task logic
                }}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause Task
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-gray-300 hover:text-white hover:bg-[#A374FF]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Download results logic
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Results
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-gray-300 hover:text-white hover:bg-[#A374FF]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Share task logic
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Task
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={(e) => {
                  e.stopPropagation();
                  // Cancel task logic
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cancel Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            Compute Resources
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Manage and monitor your CoreNet compute resources
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-black/50 border-[#A374FF]/20">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#A374FF]/20 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:bg-[#A374FF]/20 data-[state=active]:text-white"
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-[#A374FF]/20 data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Compute Units"
              value="2,600"
              icon={<Cpu className="h-4 w-4 text-[#00E5FF]" />}
              description="Available across all compute types"
            />
            <StatsCard
              title="Active Tasks"
              value="40"
              icon={<BarChart3 className="h-4 w-4 text-[#00FFA3]" />}
              description="Currently running compute tasks"
            />
            <StatsCard
              title="Resource Usage"
              value="61.5%"
              icon={<Gauge className="h-4 w-4 text-[#A374FF]" />}
              description="Average utilization across resources"
            />
            <StatsCard
              title="Total Tasks"
              value="156"
              icon={<Database className="h-4 w-4 text-[#00E5FF]" />}
              description="Tasks completed this month"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceCard
              resource={computeResources.aiCompute}
              type="aiCompute"
            />
            <ResourceCard
              resource={computeResources.zkCompute}
              type="zkCompute"
            />
            <ResourceCard
              resource={computeResources.mevOptimization}
              type="mevOptimization"
            />
            <ResourceCard
              resource={computeResources.dataProcessing}
              type="dataProcessing"
            />
          </div>

          <Card className="bg-black/50 border-[#A374FF]/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Resource Usage Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-[#00E5FF]" />
                    <span className="text-sm text-gray-300">AI Compute</span>
                  </div>
                  <ResourceChart resource={computeResources.aiCompute} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-[#00FFA3]" />
                    <span className="text-sm text-gray-300">ZK Compute</span>
                  </div>
                  <ResourceChart resource={computeResources.zkCompute} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-[#A374FF]" />
                    <span className="text-sm text-gray-300">
                      MEV Optimization
                    </span>
                  </div>
                  <ResourceChart resource={computeResources.mevOptimization} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-[#00E5FF]" />
                    <span className="text-sm text-gray-300">
                      Data Processing
                    </span>
                  </div>
                  <ResourceChart resource={computeResources.dataProcessing} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="bg-black/50 border-[#A374FF]/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-white">
                  Active Tasks
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A374FF]/20 hover:border-[#A374FF] hover:bg-[#A374FF]/10 text-gray-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    className="pl-8 bg-black/30 border-[#A374FF]/20 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px] bg-black/30 border-[#A374FF]/20 text-gray-300">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-[#A374FF]/20">
                      <SelectItem value="all" className="text-gray-300">
                        All Types
                      </SelectItem>
                      <SelectItem value="AI Compute" className="text-gray-300">
                        AI Compute
                      </SelectItem>
                      <SelectItem value="ZK Compute" className="text-gray-300">
                        ZK Compute
                      </SelectItem>
                      <SelectItem
                        value="MEV Optimization"
                        className="text-gray-300"
                      >
                        MEV Optimization
                      </SelectItem>
                      <SelectItem
                        value="Data Processing"
                        className="text-gray-300"
                      >
                        Data Processing
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px] bg-black/30 border-[#A374FF]/20 text-gray-300">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-[#A374FF]/20">
                      <SelectItem value="all" className="text-gray-300">
                        All Statuses
                      </SelectItem>
                      <SelectItem value="running" className="text-gray-300">
                        Running
                      </SelectItem>
                      <SelectItem value="queued" className="text-gray-300">
                        Queued
                      </SelectItem>
                      <SelectItem value="completed" className="text-gray-300">
                        Completed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border border-[#A374FF]/20">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#A374FF]/20 hover:bg-transparent">
                      <TableHead
                        className="text-gray-300 cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          Name
                          {sortField === "name" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead
                        className="text-gray-300 cursor-pointer"
                        onClick={() => handleSort("progress")}
                      >
                        <div className="flex items-center">
                          Progress
                          {sortField === "progress" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-gray-300 cursor-pointer"
                        onClick={() => handleSort("computeUnits")}
                      >
                        <div className="flex items-center">
                          Compute Units
                          {sortField === "computeUnits" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">Memory</TableHead>
                      <TableHead className="text-gray-300">GPU</TableHead>
                      <TableHead
                        className="text-gray-300 cursor-pointer"
                        onClick={() => handleSort("startTime")}
                      >
                        <div className="flex items-center">
                          Start Time
                          {sortField === "startTime" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">
                        Est. End Time
                      </TableHead>
                      <TableHead className="text-gray-300 w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TaskRow key={task.id} task={task} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-black/50 border-[#A374FF]/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Resource Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resource Management Dialog */}
      <Dialog
        open={isResourceDialogOpen}
        onOpenChange={setIsResourceDialogOpen}
      >
        <DialogContent className="bg-black/90 border-[#A374FF]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
              Manage {selectedResource?.type} Resources
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Adjust resource allocation for {selectedResource?.type}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label className="text-gray-300">Resource Allocation</Label>
                <span className="text-white">{resourceAllocation} CU</span>
              </div>
              <Slider
                value={[resourceAllocation]}
                onValueChange={(value) => setResourceAllocation(value[0])}
                min={0}
                max={selectedResource?.total || 1000}
                step={10}
                className="[&>span]:bg-gradient-to-r [&>span]:from-[#00FFA3] [&>span]:via-[#00E5FF] [&>span]:to-[#A374FF]"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0 CU</span>
                <span>{selectedResource?.total || 1000} CU</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Current Usage</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Used</div>
                  <div className="text-xl text-white">
                    {selectedResource?.used || 0} CU
                  </div>
                </div>
                <div className="bg-black/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400">Available</div>
                  <div className="text-xl text-white">
                    {(selectedResource?.total || 0) -
                      (selectedResource?.used || 0)}{" "}
                    CU
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-[#A374FF]/20 hover:border-[#A374FF] hover:bg-[#A374FF]/10 text-gray-300"
              onClick={() => setIsResourceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90"
              onClick={() => {
                // Save resource allocation logic
                setIsResourceDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
