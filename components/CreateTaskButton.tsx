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
import { Textarea } from "@/components/ui/textarea";

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
  computeUnits: z.coerce
    .number()
    .min(100, "Minimum 100 CU")
    .max(10000, "Maximum 10000 CU"),
  memory: z.coerce.number().min(1, "Minimum 1GB").max(64, "Maximum 64GB"),
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
  dataset: z.string().min(1, "Dataset is required"),
});

const predictSchema = baseSchema.extend({
  // dataset: z.string().min(1, "Dataset is required"),
});

export function CreateTaskButton() {
  const [taskType, setTaskType] = React.useState<(typeof taskTypes)[number]>();
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
      <DialogContent className="sm:max-w-[425px] bg-black/90 border-[#A374FF]/20">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your AI task settings
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
                    onValueChange={(value: (typeof taskTypes)[number]) => {
                      field.onChange(value);
                      handleTaskTypeChange(value);
                    }}
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
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black/50 w-full border-[#A374FF]/20 text-white">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black/90 border-[#A374FF]/20">
                      {models.map((model) => (
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

            {taskType === "AI Training" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="epochs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Epochs</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10"
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
                    name="batchSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">
                          Batch Size
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="32"
                            className="bg-black/50 border-[#A374FF]/20 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="learningRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">
                        Learning Rate
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="0.001"
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
                  name="dataset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Dataset</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter dataset path or URL"
                          className="bg-black/50 border-[#A374FF]/20 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {taskType === "AI Predict" && <> </>}

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
