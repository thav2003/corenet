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

const taskTypes = ["AI Training", "AI Predict"] as const;

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
  model: z.string().min(1, "Model is required"),
  numGpus: z.number().min(1, "Must be at least 1"),
  vcpuPerGpu: z.number().min(1, "Must be at least 1"),
  ramPerGpu: z.number().min(1, "Must be at least 1"),
  diskSize: z.number().min(1, "Must be at least 1"),
});

type BaseFormData = z.infer<typeof baseSchema>;

export function CreateTaskButton() {
  const [taskType, setTaskType] = React.useState<(typeof taskTypes)[number]>();
  const [open, setOpen] = React.useState(false);
  const [trainingScript, setTrainingScript] = React.useState<File | null>(null);
  const [installCommand, setInstallCommand] = React.useState("");
  const [runCommand, setRunCommand] = React.useState("");

  const form = useForm<BaseFormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: "",
      type: undefined,
      model: "",
      numGpus: 1,
      vcpuPerGpu: 1,
      ramPerGpu: 8,
      diskSize: 10,
    },
  });

  function onSubmit(values: BaseFormData) {
    if (taskType === "AI Training") {
      if (!trainingScript) {
        form.setError("type", { message: "Training script is required" });
        return;
      }
      if (!installCommand) {
        form.setError("type", { message: "Install command is required" });
        return;
      }
      if (!runCommand) {
        form.setError("type", { message: "Run command is required" });
        return;
      }
    }

    const finalValues = {
      ...values,
      ...(taskType === "AI Training" && {
        trainingScript,
        installCommand,
        runCommand,
      }),
    };

    console.log(finalValues);
  }

  const handleTaskTypeChange = (value: (typeof taskTypes)[number]) => {
    setTaskType(value);
    form.reset();
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
        <Button className="bg-[#A374FF] text-white transition-colors hover:bg-[#B68FFF]">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-white border-[#E8EFFF]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#A374FF]">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-[#64748B]">
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
                      <FormLabel className="text-[#334155]">
                        Task Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter task name"
                          className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#334155]">
                          Task Type
                        </FormLabel>
                        <Select
                          onValueChange={(
                            value: (typeof taskTypes)[number]
                          ) => {
                            field.onChange(value);
                            handleTaskTypeChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#F8FAFC] w-full border-[#E8EFFF] text-[#334155]">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-[#E8EFFF]">
                            {taskTypes.map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="text-[#334155] focus:bg-[#F8FAFC] focus:text-[#334155]"
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
                        <FormLabel className="text-[#334155]">Model</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#F8FAFC] w-full border-[#E8EFFF] text-[#334155]">
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-[#E8EFFF]">
                            {models.map((model) => (
                              <SelectItem
                                key={model}
                                value={model}
                                className="text-[#334155] focus:bg-[#F8FAFC] focus:text-[#334155]"
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numGpus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#334155]">
                          GPU Count
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[#64748B] text-xs">
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
                        <FormLabel className="text-[#334155]">
                          Disk (GB)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[#64748B] text-xs">
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
                        <FormLabel className="text-[#334155]">
                          vCPU/GPU
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="4"
                            className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[#64748B] text-xs">
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
                        <FormLabel className="text-[#334155]">
                          RAM/GPU
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="16"
                            className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[#64748B] text-xs">
                          8-64 GB
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Right Column - Training Config */}
              <div className="space-y-4">
                {!taskType && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#E8EFFF] rounded-lg bg-[#F8FAFC]">
                    <div className="mb-4">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto text-[#A374FF]"
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
                    <h3 className="text-lg font-medium text-[#334155] mb-2">
                      Select a Task Type
                    </h3>
                    <p className="text-sm text-[#64748B]">
                      Choose a task type from the left to configure additional
                      settings
                    </p>
                  </div>
                )}
                {taskType === "AI Training" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Training Script</Label>
                      <Input
                        type="file"
                        accept=".py,.ipynb,.zip"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setTrainingScript(file);
                          }
                        }}
                        className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] file:mr-4 file:px-4 
                        file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#A374FF] 
                        file:text-white hover:file:bg-[#B68FFF]"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Install Command</Label>
                      <Input
                        placeholder="pip install -r requirements.txt"
                        className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] font-mono"
                        value={installCommand}
                        onChange={(e) => setInstallCommand(e.target.value)}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Run Command</Label>
                      <Input
                        placeholder="python train.py"
                        className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] font-mono"
                        value={runCommand}
                        onChange={(e) => setRunCommand(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {taskType === "AI Predict" && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#E8EFFF] rounded-lg bg-[#F8FAFC]">
                    <div className="mb-4">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto text-[#A374FF]"
                      >
                        <path
                          d="M12 8V12L14 14M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[#334155] mb-2">
                      Prediction Task Selected
                    </h3>
                    <p className="text-sm text-[#64748B]">
                      Configure your basic settings on the left to create a
                      prediction task
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-[#A374FF] text-white transition-colors hover:bg-[#B68FFF]"
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
