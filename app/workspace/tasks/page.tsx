"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Plus, CheckCircle2, Clock, AlertCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockTasks, Task } from "../mockTasks";

// Get unique models from mockTasks
const userModels = Array.from(new Set(mockTasks.map((t) => t.model))).map(
  (name, idx) => ({ id: idx + 1, name })
);

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-[#00E5FF]" />;
      case "running":
        return <Clock className="h-4 w-4 text-[#00FFA3]" />;
      case "failed":
      case "queued":
        return <AlertCircle className="h-4 w-4 text-[#A374FF]" />;
      default:
        return null;
    }
  };

  const handleCreateTask = () => {
    if (!taskName || !selectedModel) return;
    setTasks([
      ...tasks,
      {
        id: tasks.length + 1,
        name: taskName,
        model:
          userModels.find((m) => m.id.toString() === selectedModel)?.name || "",
        type: "AI Compute",
        status: "running",
        progress: 0,
        timeLeft: "Pending",
        created: new Date().toISOString().slice(0, 10),
        details: {
          computeUnits: 1000,
          memory: 4,
          gpu: false,
          cost: 0.5,
          logs: ["Task created"],
        },
      },
    ]);
    setIsDialogOpen(false);
    setTaskName("");
    setSelectedModel(undefined);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
          My Tasks
        </h1>
        <Button
          className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90 flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Create Task
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-black/50 border-[#A374FF]/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                {getStatusIcon(task.status)}
                {task.name}
              </CardTitle>
              <span className="text-xs text-gray-400">{task.model}</span>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Date: {task.created}</span>
                <span className="capitalize">{task.status}</span>
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#A374FF]/20 hover:border-[#A374FF] hover:bg-[#A374FF]/10 text-gray-300 flex items-center gap-1"
                  onClick={() => router.push(`/workspace/tasks/${task.id}`)}
                >
                  <Eye className="h-4 w-4" />
                  Detail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-[#A374FF]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
              Create Task
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="bg-black/30 border-[#A374FF]/20 text-white"
            />
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-black/30 border-[#A374FF]/20 text-white">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-[#A374FF]/20">
                {userModels.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id.toString()}
                    className="text-gray-300"
                  >
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-[#A374FF]/20 hover:border-[#A374FF] hover:bg-[#A374FF]/10 text-gray-300"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90"
              onClick={handleCreateTask}
              disabled={!taskName || !selectedModel}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
