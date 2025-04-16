export interface TaskDetail {
  startTime?: string;
  endTime?: string;
  computeUnits: number;
  memory: number;
  gpu: boolean;
  cost: number;
  logs: string[];
  // Training specific fields
  epochs?: number;
  batchSize?: number;
  learningRate?: number;
  dataset?: string;
  datasetSize?: number;
  result?: string;
  // Prediction specific fields
  prompt?: string;
}

export interface Task {
  id: number;
  name: string;
  model: string;
  type: "AI Training" | "AI Predict";
  status: "created" | "running" | "completed" | "failed" | "queued";
  progress: number;
  timeLeft: string;
  created: string;
  details: TaskDetail;
}

export const mockTasks: Task[] = [
  {
    id: 1,
    name: "BERT Fine-tuning",
    type: "AI Training",
    model: "BERT",
    status: "created",
    progress: 0,
    timeLeft: "Waiting",
    created: "2024-06-15",
    details: {
      computeUnits: 2000,
      memory: 16,
      gpu: true,
      cost: 150,
      epochs: 10,
      batchSize: 32,
      learningRate: 0.001,
      dataset: "custom_nlp_dataset.json",
      datasetSize: 10000,
      logs: [
        "Initializing training environment...",
        "Loading dataset...",
        "Ready to start training",
      ],
    },
  },
  {
    id: 2,
    name: "GPT-3 Text Generation",
    type: "AI Predict",
    model: "GPT-3",
    status: "running",
    progress: 45,
    timeLeft: "1h 15m",
    created: "2024-06-15",
    details: {
      computeUnits: 1000,
      memory: 8,
      gpu: true,
      cost: 75,
      prompt: "Generate a story about a space adventure",
      logs: ["Loading model...", "Processing prompt...", "Generating text..."],
      startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
  },
  {
    id: 3,
    name: "ResNet Training",
    type: "AI Training",
    model: "ResNet",
    status: "running",
    progress: 75,
    timeLeft: "1h 15m",
    created: "2024-06-15",
    details: {
      computeUnits: 3000,
      memory: 32,
      gpu: true,
      cost: 250,
      epochs: 50,
      batchSize: 64,
      learningRate: 0.0001,
      dataset: "imagenet_subset.zip",
      datasetSize: 50000,
      logs: [
        "Training started...",
        "Loading dataset...",
        "Dataset loaded successfully",
        "Starting epoch 1/50",
        "Epoch 37/50 completed",
        "Current accuracy: 92.5%",
      ],
      startTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    },
  },
  {
    id: 4,
    name: "Stable Diffusion Generation",
    type: "AI Predict",
    model: "Stable Diffusion",
    status: "completed",
    progress: 100,
    timeLeft: "Completed",
    created: "2024-06-15",
    details: {
      computeUnits: 1500,
      memory: 16,
      gpu: true,
      cost: 100,
      prompt: "A cyberpunk city at night with neon lights and flying cars",
      logs: [
        "Model loaded successfully",
        "Processing prompt...",
        "Generating image...",
        "Applying post-processing...",
        "Generation completed",
      ],
      startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      endTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      result: "generated_image.png",
    },
  },
  {
    id: 5,
    name: "BERT Training",
    type: "AI Training",
    model: "BERT",
    status: "completed",
    progress: 100,
    timeLeft: "Completed",
    created: "2024-06-15",
    details: {
      computeUnits: 2500,
      memory: 24,
      gpu: true,
      cost: 200,
      epochs: 20,
      batchSize: 32,
      learningRate: 0.0005,
      dataset: "sentiment_analysis_dataset.json",
      datasetSize: 25000,
      logs: [
        "Training completed",
        "Final accuracy: 94.8%",
        "Model saved successfully",
      ],
      startTime: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
      endTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      result: "bert_model_v1.zip",
    },
  },
  {
    id: 6,
    name: "Transformer Training",
    type: "AI Training",
    model: "Transformer",
    status: "failed",
    progress: 35,
    timeLeft: "Failed",
    created: "2024-06-15",
    details: {
      computeUnits: 2000,
      memory: 16,
      gpu: true,
      cost: 120,
      epochs: 15,
      batchSize: 32,
      learningRate: 0.001,
      dataset: "translation_dataset.json",
      datasetSize: 100000,
      logs: [
        "Training started",
        "Loading dataset...",
        "Epoch 5/15 completed",
        "Error: Out of memory",
        "Training failed",
      ],
      startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      endTime: new Date(Date.now() - 1000 * 60 * 40).toISOString(), // 40 minutes ago
    },
  },
];
