"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useBlockchain } from "@/hooks/useBlockchain";
import { Plus } from "lucide-react";

export function NewTaskDialog() {
  const { createTask } = useBlockchain();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "AI Compute",
    computeUnits: 1000,
    memory: 4,
    gpu: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask({
        name: formData.name,
        type: formData.type as any,
        details: {
          computeUnits: formData.computeUnits,
          memory: formData.memory,
          gpu: formData.gpu,
          cost: 0, // Will be calculated on-chain
          logs: [],
          startTime: Date.now(),
        },
      });
      setOpen(false);
      setFormData({
        name: "",
        type: "AI Compute",
        computeUnits: 1000,
        memory: 4,
        gpu: false,
      });
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-[#A374FF]/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Configure your compute task parameters
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-200">
              Task Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-black/50 border-[#A374FF]/20 text-white"
              placeholder="Enter task name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-200">
              Task Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="bg-black/50 border-[#A374FF]/20 text-white">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-[#A374FF]/20">
                <SelectItem value="AI Compute" className="text-white">
                  AI Compute
                </SelectItem>
                <SelectItem value="ZK Compute" className="text-white">
                  ZK Compute
                </SelectItem>
                <SelectItem value="MEV Optimization" className="text-white">
                  MEV Optimization
                </SelectItem>
                <SelectItem value="Data Processing" className="text-white">
                  Data Processing
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="computeUnits" className="text-gray-200">
              Compute Units
            </Label>
            <Input
              id="computeUnits"
              type="number"
              value={formData.computeUnits}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  computeUnits: Number(e.target.value),
                })
              }
              className="bg-black/50 border-[#A374FF]/20 text-white"
              min={100}
              step={100}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="memory" className="text-gray-200">
              Memory (GB)
            </Label>
            <Input
              id="memory"
              type="number"
              value={formData.memory}
              onChange={(e) =>
                setFormData({ ...formData, memory: Number(e.target.value) })
              }
              className="bg-black/50 border-[#A374FF]/20 text-white"
              min={1}
              step={1}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="gpu" className="text-gray-200">
              Enable GPU
            </Label>
            <Switch
              id="gpu"
              checked={formData.gpu}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, gpu: checked })
              }
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-[#A374FF]/20 hover:border-[#A374FF] hover:bg-[#A374FF]/10 text-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
