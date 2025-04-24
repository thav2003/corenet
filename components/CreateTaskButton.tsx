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
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";

const taskTypes = ["AI Training"] as const;
// const taskTypes = ["AI Training", "AI Predict"] as const;

const models = [
  "GPT-3",
  "BERT",
  "Stable Diffusion",
  "ResNet",
  "Transformer",
] as const;

const baseSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  type: z.enum(taskTypes),
  numGpus: z.number().min(1, "Must be at least 1").max(8, "Maximum 8 GPUs"),
  vcpuPerGpu: z
    .number()
    .min(2, "Must be at least 2")
    .max(16, "Maximum 16 vCPUs"),
  ramPerGpu: z.number().min(8, "Must be at least 8").max(64, "Maximum 64 GB"),
  diskSize: z
    .number()
    .min(10, "Must be at least 10")
    .max(1000, "Maximum 1000 GB"),
});

const predictSchema = baseSchema.extend({
  model: z.string().min(1, "Model is required"),
});

type BaseFormData = z.infer<typeof baseSchema>;
type PredictFormData = z.infer<typeof predictSchema>;

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const data = await response.json();
  return data.path;
}

interface CreateTaskButtonProps {
  onSuccess?: () => void;
}

export function CreateTaskButton({ onSuccess }: CreateTaskButtonProps) {
  const { publicKey } = useWallet();
  const [taskType, setTaskType] = React.useState<(typeof taskTypes)[number]>();
  const [open, setOpen] = React.useState(false);
  const [trainingScript, setTrainingScript] = React.useState<File | null>(null);
  const [installCommand, setInstallCommand] = React.useState("");
  const [runCommand, setRunCommand] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BaseFormData | PredictFormData>({
    resolver: zodResolver(
      taskType === "AI Predict" ? predictSchema : baseSchema
    ),
    defaultValues: {
      name: "",
      type: undefined,
      numGpus: 1,
      vcpuPerGpu: 2,
      ramPerGpu: 8,
      diskSize: 10,
    },
  });

  async function onSubmit(values: BaseFormData | PredictFormData) {
    try {
      if (!publicKey) {
        throw new Error("Wallet address is required");
      }
      setIsSubmitting(true);

      let scriptPath = null;
      if (taskType === "AI Training" && trainingScript) {
        scriptPath = await uploadFile(trainingScript);
      }

      const taskData = {
        ...values,
        scriptPath,
        installCommand: installCommand || undefined,
        runCommand: runCommand || undefined,
        walletAddress: publicKey.toBase58(),
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      console.log({
        title: "Success",
        description: "Task created successfully",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating task:", error);
      console.log({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleTaskTypeChange = (value: (typeof taskTypes)[number]) => {
    setTaskType(value);
    setTrainingScript(null);
    setInstallCommand("");
    setRunCommand("");
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setTaskType(undefined);
      setTrainingScript(null);
      setInstallCommand("");
      setRunCommand("");
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#0d2341] text-gray-200 border border-[#1a2b44] hover:bg-[#1a2b44] transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0A1A2F]  max-w-4xl! w-full border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-400">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your AI task settings
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Task Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter task name"
                          className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
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
                        onValueChange={(value: (typeof taskTypes)[number]) => {
                          field.onChange(value);
                          handleTaskTypeChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-[#0d2341] border-[#1a2b44] text-gray-200">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#0A1A2F] border-[#1a2b44]">
                          {taskTypes.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="text-gray-200 focus:bg-[#1a2b44] focus:text-gray-200"
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numGpus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">
                          GPU Count
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400 text-xs">
                          1-8 GPUs
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diskSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">
                          Disk (GB)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400 text-xs">
                          10-1000 GB
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vcpuPerGpu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">
                          vCPU/GPU
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="4"
                            className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400 text-xs">
                          2-16 vCPUs
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ramPerGpu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">RAM/GPU</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="16"
                            className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400 text-xs">
                          8-64 GB
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {!taskType && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#1a2b44] rounded-lg bg-[#0d2341]">
                    <div className="mb-4">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto text-blue-400"
                      >
                        <path
                          d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-200 mb-2">
                      Select a Task Type
                    </h3>
                    <p className="text-sm text-gray-400">
                      Choose a task type from the left to configure additional
                      settings
                    </p>
                  </div>
                )}
                {taskType === "AI Training" && (
                  <div className="space-y-6">
                    <div className="pb-4 mb-2 border-b border-[#1a2b44]">
                      <h3 className="text-lg font-medium text-gray-200 mb-1">
                        Training Configuration
                      </h3>
                      <p className="text-sm text-gray-400">
                        Upload your training script and set up commands
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label className="mb-2">Training Script</Label>
                        <Input
                          type="file"
                          accept=".py,.ipynb,.zip"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setTrainingScript(file);
                            }
                          }}
                          className="bg-[#0d2341] border-[#1a2b44] text-gray-200 file:mr-4 
                          file:px-4 file:rounded-full file:border-0 
                          file:text-sm file:font-semibold
                          file:bg-[#0d2341] file:text-gray-200 
                          file:hover:bg-[#1a2b44] file:transition-colors"
                        />
                      </div>

                      <div>
                        <Label className="mb-2">Install Command</Label>
                        <Input
                          placeholder="pip install -r requirements.txt"
                          className="bg-[#0d2341] border-[#1a2b44] text-gray-200 font-mono"
                          value={installCommand}
                          onChange={(e) => setInstallCommand(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label className="mb-2">Run Command</Label>
                        <Input
                          placeholder="python train.py"
                          className="bg-[#0d2341] border-[#1a2b44] text-gray-200 font-mono"
                          value={runCommand}
                          onChange={(e) => setRunCommand(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {taskType === "AI Predict" && (
                  <div className="space-y-6">
                    <div className="pb-4 mb-2 border-b border-[#1a2b44]">
                      <h3 className="text-lg font-medium text-gray-200 mb-1">
                        Model Selection
                      </h3>
                      <p className="text-sm text-gray-400">
                        Choose a pre-trained model for prediction
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">
                            Select Model
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#0d2341] w-full border-[#1a2b44] text-gray-200">
                                <SelectValue placeholder="Choose a model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#0A1A2F] border-[#1a2b44]">
                              {models.map((model) => (
                                <SelectItem
                                  key={model}
                                  value={model}
                                  className="text-gray-200 focus:bg-[#1a2b44] focus:text-gray-200"
                                >
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-gray-400 text-sm">
                            Select from our available pre-trained models
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0d2341] text-gray-200 border border-[#1a2b44] hover:bg-[#1a2b44] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
