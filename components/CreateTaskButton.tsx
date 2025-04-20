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
  type: z.enum(taskTypes, {
    required_error: "Please select a task type",
  }),
  model: z.enum(models, {
    required_error: "Please select a model",
  }),
  gpuCount: z.coerce.number().min(1, "Minimum 1 GPU").max(8, "Maximum 8 GPUs"),
  diskSize: z.coerce
    .number()
    .min(10, "Minimum 10GB")
    .max(1000, "Maximum 1000GB"),
  minVCPUPerGPU: z.coerce
    .number()
    .min(2, "Minimum 2 vCPUs per GPU")
    .max(16, "Maximum 16 vCPUs per GPU"),
  minRAMPerGPU: z.coerce
    .number()
    .min(8, "Minimum 8GB RAM per GPU")
    .max(64, "Maximum 64GB RAM per GPU"),
  trainingScript: z.instanceof(File, {
    message: "Training script is required",
  }),
  dataset: z.instanceof(File, { message: "Dataset is required" }),
  pretrainedModel: z.instanceof(File).optional(),
});

const trainingSchema = baseSchema.extend({
  epochs: z.coerce
    .number()
    .min(1, "Minimum 1 epoch")
    .max(100, "Maximum 100 epochs"),
  batchSize: z.coerce
    .number()
    .min(1, "Minimum batch size 1")
    .max(512, "Maximum batch size 512"),
  learningRate: z.coerce
    .number()
    .min(0.0001, "Minimum learning rate 0.0001")
    .max(1, "Maximum learning rate 1"),
});

const predictSchema = baseSchema.extend({
  // dataset: z.string().min(1, "Dataset is required"),
});

export function CreateTaskButton() {
  const [taskType, setTaskType] = React.useState<(typeof taskTypes)[number]>();
  const [trainingScript, setTrainingScript] = React.useState<File | null>(null);
  const [dataset, setDataset] = React.useState<File | null>(null);
  const [pretrainedModel, setPretrainedModel] = React.useState<File | null>(
    null
  );
  const form = useForm<
    z.infer<typeof trainingSchema> | z.infer<typeof predictSchema>
  >({
    resolver: zodResolver(
      taskType === "AI Training" ? trainingSchema : predictSchema
    ),
  });

  function onSubmit(
    values: z.infer<typeof trainingSchema> | z.infer<typeof predictSchema>
  ) {
    console.log(values);
  }

  const handleTaskTypeChange = (value: (typeof taskTypes)[number]) => {
    setTaskType(value);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-white border-[#E8EFFF]">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
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
                    name="gpuCount"
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
                    name="minVCPUPerGPU"
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
                    name="minRAMPerGPU"
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

              {/* Right Column - File Uploads */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="trainingScript"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#334155]">
                        Training Script
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".py,.ipynb"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setTrainingScript(file);
                              field.onChange(file);
                            }
                          }}
                          className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] file:mr-4 file:px-4 
                          file:rounded-full file:border-0 file:text-sm file:font-semibold 
                          file:bg-[#00FFA3] file:text-white hover:file:bg-[#00E5FF] 
                          file:cursor-pointer hover:file:cursor-pointer
                          flex items-center"
                        />
                      </FormControl>
                      <FormDescription className="text-[#64748B] text-xs">
                        Upload your Python script or Jupyter notebook
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#334155]">Dataset</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".csv,.json,.zip,.tar.gz"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDataset(file);
                              field.onChange(file);
                            }
                          }}
                          className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] file:mr-4 file:px-4 
                          file:rounded-full file:border-0 file:text-sm file:font-semibold 
                          file:bg-[#00FFA3] file:text-white hover:file:bg-[#00E5FF] 
                          file:cursor-pointer hover:file:cursor-pointer
                          flex items-center"
                        />
                      </FormControl>
                      <FormDescription className="text-[#64748B] text-xs">
                        Upload your dataset file (CSV, JSON, or compressed
                        archive)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pretrainedModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#334155]">
                        Pre-trained Model (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".h5,.pth,.onnx,.pb"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPretrainedModel(file);
                              field.onChange(file);
                            }
                          }}
                          className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155] file:mr-4 file:px-4 
                          file:rounded-full file:border-0 file:text-sm file:font-semibold 
                          file:bg-[#00FFA3] file:text-white hover:file:bg-[#00E5FF] 
                          file:cursor-pointer hover:file:cursor-pointer
                          flex items-center"
                        />
                      </FormControl>
                      <FormDescription className="text-[#64748B] text-xs">
                        Upload your pre-trained model file (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {taskType === "AI Training" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="epochs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#334155]">
                            Epochs
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10"
                              className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="batchSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#334155]">
                            Batch Size
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="32"
                              className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {taskType === "AI Training" && (
                  <FormField
                    control={form.control}
                    name="learningRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#334155]">
                          Learning Rate
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0001"
                            placeholder="0.001"
                            className="bg-[#F8FAFC] border-[#E8EFFF] text-[#334155]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
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
