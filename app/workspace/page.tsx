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
  Brain,
  DollarSign,
  LayoutGrid,
  Loader2,
  XCircle,
  Circle,
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
import { CreateTaskButton } from "@/components/CreateTaskButton";
import { cn } from "@/lib/utils";

export default function WorkspacePage() {
  const router = useRouter();
  const [, setActiveTab] = useState("overview");
  const stats = getTaskStats();
  const { training, predict } = groupTasksByType(mockTasks);

  const totalComputeUnits = mockTasks.reduce(
    (total, task) => total + task.details.computeUnits,
    0
  );
  const totalCost = mockTasks.reduce(
    (total, task) => total + task.details.cost,
    0
  );
  function getTaskStats() {
    return {
      totalTasks: mockTasks.length,
      totalComputeUnits: mockTasks.reduce(
        (acc, task) => acc + task.details.computeUnits,
        0
      ),
      totalCost: mockTasks.reduce((acc, task) => acc + task.details.cost, 0),
      totalModels: new Set(mockTasks.map((task) => task.model)).size,
    };
  }

  function groupTasksByType(tasks: Task[]) {
    return tasks.reduce(
      (acc, task) => {
        if (task.type === "AI Training") {
          acc.training.push(task);
        } else {
          acc.predict.push(task);
        }
        return acc;
      },
      { training: [] as Task[], predict: [] as Task[] }
    );
  }

  const StatusIcon = ({
    status,
    className,
  }: {
    status: string;
    className: string;
  }) => {
    switch (status) {
      case "created":
        return <Circle className={className} />;
      case "running":
        return <Loader2 className={className} />;
      case "completed":
        return <CheckCircle2 className={className} />;
      case "queued":
        return <Clock className={className} />;
      case "failed":
        return <XCircle className={className} />;
      default:
        return null;
    }
  };
  function TaskCard({ task }: { task: Task }) {
    const statusColors = {
      running: "text-blue-500",
      created: "text-gray-500",
      completed: "text-green-500",
      queued: "text-yellow-500",
      failed: "text-red-500",
    };

    return (
      <Card
        className="p-4 bg-white border-[#E8EFFF] shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all"
        onClick={() => router.push(`/workspace/tasks/${task.id}`)}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-[#334155]">{task.name}</h3>
            <p className="text-sm text-[#64748B]">{task.model}</p>
          </div>
          <StatusIcon
            status={task.status}
            className={cn(
              "h-5 w-5",
              statusColors[task.status as keyof typeof statusColors],
              task.status === "running" && "animate-spin"
            )}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#64748B]">Progress</span>
            <span className="text-[#334155]">{task.progress}%</span>
          </div>
          <Progress
            value={task.progress}
            className="h-1 bg-[#F1F5F9] [&>div]:bg-gradient-to-r [&>div]:from-[#00FFA3] [&>div]:via-[#00E5FF] [&>div]:to-[#A374FF]"
          />
          <div className="flex justify-between text-sm">
            <span className="text-[#64748B]">Compute Units</span>
            <span className="text-[#334155]">
              {task.details.computeUnits} CU
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#64748B]">Cost</span>
            <span className="text-[#334155]">${task.details.cost}</span>
          </div>
          {task.type === "AI Training" && (
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B]">Epochs</span>
              <span className="text-[#334155]">{task.details.epochs}</span>
            </div>
          )}
          {task.type === "AI Predict" && (
            <div className="flex justify-between text-sm">
              <span className="text-[#64748B]">Dataset Size</span>
              <span className="text-[#334155]">
                {task.details.datasetSize?.toLocaleString()} samples
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }

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
    <Card className="bg-white border-[#E8EFFF] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-[#334155]">
            {title}
          </CardTitle>
          <div className="p-2 rounded-full bg-gradient-to-r from-[#00FFA3]/10 via-[#00E5FF]/10 to-[#A374FF]/10">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-500">{value}</div>
        <p className="text-xs text-[#64748B] mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">
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
          title="Total Tasks"
          value={stats.totalTasks.toString()}
          icon={<Cpu className="h-4 w-4 text-[#00E5FF]" />}
          description="Total tasks created"
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
          title="Total Models"
          value={stats.totalModels.toString()}
          icon={<Cpu className="h-4 w-4 text-[#00E5FF]" />}
          description="Total models used"
        />
      </div>

      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-[#F8FAFC] border border-[#E8EFFF] p-1">
          <TabsTrigger
            value="overview"
            className="text-[#64748B] hover:text-[#334155] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/10 data-[state=active]:via-[#00E5FF]/10 data-[state=active]:to-[#A374FF]/10 data-[state=active]:text-[#334155] hover:bg-[#A374FF]/10 transition-colors"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className="text-[#64748B] hover:text-[#334155] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/10 data-[state=active]:via-[#00E5FF]/10 data-[state=active]:to-[#A374FF]/10 data-[state=active]:text-[#334155] hover:bg-[#A374FF]/10 transition-colors"
          >
            Training Tasks
          </TabsTrigger>
          <TabsTrigger
            value="predict"
            className="text-[#64748B] hover:text-[#334155] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FFA3]/10 data-[state=active]:via-[#00E5FF]/10 data-[state=active]:to-[#A374FF]/10 data-[state=active]:text-[#334155] hover:bg-[#A374FF]/10 transition-colors"
          >
            Prediction Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {training.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predict" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predict.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
