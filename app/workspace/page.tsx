"use client";

import React, { useState } from "react";
import {
  Cpu,
  Shield,
  Settings,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { mockTasks, Task } from "./mockTasks";
import { CreateTaskButton } from "../../components/CreateTaskButton";

// Group tasks by type
const groupTasksByType = (tasks: Task[]) => {
  return {
    aiCompute: tasks.filter((t) => t.type === "AI Compute"),
    zkCompute: tasks.filter((t) => t.type === "ZK Compute"),
    mevOptimization: tasks.filter((t) => t.type === "MEV Optimization"),
    dataProcessing: tasks.filter((t) => t.type === "Data Processing"),
  };
};

export default function WorkspacePage() {
  const router = useRouter();
  const [, setActiveTab] = useState("overview");
  const grouped = groupTasksByType(mockTasks);

  const totalComputeUnits = mockTasks.reduce(
    (total, task) => total + task.details.computeUnits,
    0
  );
  const totalCost = mockTasks.reduce(
    (total, task) => total + task.details.cost,
    0
  );

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
        return "";
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="bg-black/50 border-[#A374FF]/20 hover:border-[#A374FF]/40 transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            {task.name}
          </CardTitle>
          <div
            className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${getStatusColor(
              task.status
            )}`}
          >
            {getStatusIcon(task.status)}
            <span className="capitalize">{task.status}</span>
          </div>
        </div>
        <CardDescription className="text-xs text-gray-400">
          {task.type}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <Progress
            value={task.progress}
            className="h-1 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-[#00FFA3] [&>div]:via-[#00E5FF] [&>div]:to-[#A374FF]"
          />
          <div className="text-xs text-gray-400">
            Time remaining: {task.timeLeft}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-[#A374FF]/20 hover:border-[#A374FF] hover:bg-[#A374FF]/10 text-xs"
          onClick={() => router.push(`/workspace/tasks/${task.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );

  const StatsCard = ({
    title,
    value,
    icon,
    description,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    description: string;
  }) => (
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
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            Workspace Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and monitor your CoreNet compute tasks
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#A374FF]/20 hover:border-[#A374FF] hover:bg-[#A374FF]/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <CreateTaskButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Tasks"
          value={mockTasks
            .filter((t) => t.status === "running")
            .length.toString()}
          icon={<Cpu className="h-4 w-4 text-[#00E5FF]" />}
          description="Currently running compute tasks"
        />
        <StatsCard
          title="Total Compute"
          value={`${totalComputeUnits} CU`}
          icon={<Shield className="h-4 w-4 text-[#00FFA3]" />}
          description="Total compute units allocated"
        />
        <StatsCard
          title="Total Cost"
          value={`${totalCost.toFixed(2)} SOL`}
          icon={<Wallet className="h-4 w-4 text-[#A374FF]" />}
          description="Total cost of all tasks"
        />
        <StatsCard
          title="GPU Tasks"
          value={mockTasks.filter((t) => t.details.gpu).length.toString()}
          icon={<Cpu className="h-4 w-4 text-[#00E5FF]" />}
          description="Tasks using GPU acceleration"
        />
      </div>

      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-black/50 border border-[#A374FF]/20 p-1">
          <TabsTrigger
            value="overview"
            className="text-gray-400 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/30 data-[state=active]:via-[#00E5FF]/30 data-[state=active]:to-[#A374FF]/30 data-[state=active]:text-white hover:bg-[#A374FF]/20 transition-colors"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="aiCompute"
            className="text-gray-400 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/30 data-[state=active]:via-[#00E5FF]/30 data-[state=active]:to-[#A374FF]/30 data-[state=active]:text-white hover:bg-[#A374FF]/20 transition-colors"
          >
            AI Compute
          </TabsTrigger>
          <TabsTrigger
            value="zkCompute"
            className="text-gray-400 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/30 data-[state=active]:via-[#00E5FF]/30 data-[state=active]:to-[#A374FF]/30 data-[state=active]:text-white hover:bg-[#A374FF]/20 transition-colors"
          >
            ZK Compute
          </TabsTrigger>
          <TabsTrigger
            value="mevOptimization"
            className="text-gray-400 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/30 data-[state=active]:via-[#00E5FF]/30 data-[state=active]:to-[#A374FF]/30 data-[state=active]:text-white hover:bg-[#A374FF]/20 transition-colors"
          >
            MEV Optimization
          </TabsTrigger>
          <TabsTrigger
            value="dataProcessing"
            className="text-gray-400 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/30 data-[state=active]:via-[#00E5FF]/30 data-[state=active]:to-[#A374FF]/30 data-[state=active]:text-white hover:bg-[#A374FF]/20 transition-colors"
          >
            Data Processing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="aiCompute" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.aiCompute.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="zkCompute" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.zkCompute.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mevOptimization" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.mevOptimization.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dataProcessing" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.dataProcessing.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
