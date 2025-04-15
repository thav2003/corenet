import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const taskTypes = [
  "AI Compute",
  "ZK Compute",
  "MEV Optimization",
  "Data Processing",
] as const;

const models = {
  "AI Compute": ["Image Classifier", "Text Summarizer", "LLM Model"],
  "ZK Compute": ["Fraud Detector", "Privacy Preserver", "Zero Knowledge Proof"],
  "MEV Optimization": ["Arbitrage Bot", "Sandwich Bot", "Liquidation Bot"],
  "Data Processing": [
    "Data Analyzer",
    "Pattern Detector",
    "Blockchain Scanner",
  ],
} as const;

const formSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  type: z.enum(taskTypes, {
    required_error: "Please select a task type",
  }),
  model: z.string({
    required_error: "Please select a model",
  }),
  computeUnits: z.coerce
    .number()
    .min(100, "Minimum 100 CU")
    .max(10000, "Maximum 10000 CU"),
  memory: z.coerce.number().min(1, "Minimum 1GB").max(64, "Maximum 64GB"),
});

export function CreateTaskButton() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const selectedType = form.watch("type");

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically make an API call to create the task
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black/90 border-[#A374FF]/20">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your compute task settings
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Task Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task name"
                      className="bg-black/50 border-[#A374FF]/20 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Task Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black/50 w-full border-[#A374FF]/20 text-white">
                        <SelectValue placeholder="Select task type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black/90 border-[#A374FF]/20">
                      {taskTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-gray-200 focus:bg-[#A374FF]/20 focus:text-white"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedType}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black/50 w-full border-[#A374FF]/20 text-white">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black/90 border-[#A374FF]/20">
                      {selectedType &&
                        models[selectedType].map((model) => (
                          <SelectItem
                            key={model}
                            value={model}
                            className="text-gray-200 focus:bg-[#A374FF]/20 focus:text-white"
                          >
                            {model}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="computeUnits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">
                      Compute Units
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        className="bg-black/50 border-[#A374FF]/20 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400 text-xs">
                      100-10000 CU
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="memory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Memory (GB)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="8"
                        className="bg-black/50 border-[#A374FF]/20 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400 text-xs">
                      1-64 GB
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90"
              >
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
