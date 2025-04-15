export interface TaskDetail {
  startTime?: number;
  endTime?: number;
  computeUnits: number;
  memory: number;
  gpu: boolean;
  cost: number;
  logs: string[];
}

export interface Task {
  id: number;
  name: string;
  model: string;
  type: string;
  status: "running" | "completed" | "queued" | "failed";
  progress: number;
  timeLeft: string;
  created: string;
  details: TaskDetail;
}

export const mockTasks: Task[] = [
  {
    id: 1,
    name: "LLM Training",
    model: "Image Classifier",
    type: "AI Compute",
    status: "running",
    progress: 65,
    timeLeft: "2h 30m",
    created: "2024-06-15",
    details: {
      startTime: Date.now() - 3600000,
      computeUnits: 5000,
      memory: 16,
      gpu: true,
      cost: 2.5,
      logs: [
        "Initializing model parameters...",
        "Loading training data...",
        "Starting training loop...",
        "Epoch 1/10: Loss = 0.234",
        "Epoch 2/10: Loss = 0.198",
        "Epoch 3/10: Loss = 0.167",
        "Epoch 4/10: Loss = 0.145",
        "Epoch 5/10: Loss = 0.132",
        "Epoch 6/10: Loss = 0.124",
        "Epoch 7/10: Loss = 0.118",
        "Epoch 8/10: Loss = 0.113",
        "Epoch 9/10: Loss = 0.109",
        "Epoch 10/10: Loss = 0.106",
      ],
    },
  },
  {
    id: 2,
    name: "Image Generation",
    model: "Image Classifier",
    type: "AI Compute",
    status: "completed",
    progress: 100,
    timeLeft: "Completed",
    created: "2024-06-15",
    details: {
      startTime: Date.now() - 7200000,
      endTime: Date.now() - 3600000,
      computeUnits: 3000,
      memory: 8,
      gpu: true,
      cost: 1.8,
      logs: [
        "Initializing Stable Diffusion model...",
        "Loading prompt: 'A futuristic cityscape with flying cars'",
        "Generating image...",
        "Applying style transfer...",
        "Post-processing...",
        "Task completed successfully",
      ],
    },
  },
  {
    id: 3,
    name: "Text Classification",
    model: "Text Summarizer",
    type: "AI Compute",
    status: "queued",
    progress: 0,
    timeLeft: "Waiting",
    created: "2024-06-15",
    details: {
      computeUnits: 1000,
      memory: 4,
      gpu: false,
      cost: 0.5,
      logs: ["Task queued"],
    },
  },
  {
    id: 4,
    name: "ZK Proof Generation",
    model: "Fraud Detector",
    type: "ZK Compute",
    status: "running",
    progress: 42,
    timeLeft: "1h 15m",
    created: "2024-06-15",
    details: {
      startTime: Date.now() - 2700000,
      computeUnits: 4000,
      memory: 12,
      gpu: true,
      cost: 2.0,
      logs: [
        "Initializing ZK circuit...",
        "Loading witness data...",
        "Generating proof...",
        "Verifying proof...",
        "Proof generated successfully",
      ],
    },
  },
  {
    id: 5,
    name: "Verification",
    model: "Fraud Detector",
    type: "ZK Compute",
    status: "completed",
    progress: 100,
    timeLeft: "Completed",
    created: "2024-06-15",
    details: {
      startTime: Date.now() - 5400000,
      endTime: Date.now() - 3600000,
      computeUnits: 2000,
      memory: 6,
      gpu: false,
      cost: 1.2,
      logs: [
        "Loading proof...",
        "Verifying proof...",
        "Proof verified successfully",
      ],
    },
  },
  {
    id: 6,
    name: "MEV Extraction",
    model: "Fraud Detector",
    type: "MEV Optimization",
    status: "running",
    progress: 78,
    timeLeft: "45m",
    created: "2024-06-15",
    details: {
      startTime: Date.now() - 1800000,
      computeUnits: 3500,
      memory: 10,
      gpu: true,
      cost: 1.8,
      logs: [
        "Analyzing blockchain data...",
        "Identifying MEV opportunities...",
        "Calculating potential profit...",
        "Preparing extraction strategy...",
        "Executing extraction...",
      ],
    },
  },
  {
    id: 7,
    name: "Arbitrage Detection",
    model: "Fraud Detector",
    type: "MEV Optimization",
    status: "queued",
    progress: 0,
    timeLeft: "Waiting",
    created: "2024-06-15",
    details: {
      computeUnits: 1500,
      memory: 5,
      gpu: false,
      cost: 0.8,
      logs: ["Task queued"],
    },
  },
  {
    id: 8,
    name: "Blockchain Data Analysis",
    model: "Fraud Detector",
    type: "Data Processing",
    status: "running",
    progress: 23,
    timeLeft: "3h 45m",
    created: "2024-06-15",
    details: {
      startTime: Date.now() - 5400000,
      computeUnits: 2500,
      memory: 8,
      gpu: false,
      cost: 1.5,
      logs: [
        "Connecting to blockchain node...",
        "Fetching transaction data...",
        "Processing transactions...",
        "Analyzing patterns...",
        "Generating insights...",
      ],
    },
  },
  {
    id: 9,
    name: "Transaction Pattern Recognition",
    model: "Fraud Detector",
    type: "Data Processing",
    status: "completed",
    progress: 100,
    timeLeft: "Completed",
    created: "2024-06-15",
    details: {
      startTime: Date.now() - 10800000,
      endTime: Date.now() - 7200000,
      computeUnits: 1800,
      memory: 6,
      gpu: false,
      cost: 1.0,
      logs: [
        "Loading transaction data...",
        "Identifying patterns...",
        "Categorizing transactions...",
        "Generating report...",
        "Task completed successfully",
      ],
    },
  },
];
