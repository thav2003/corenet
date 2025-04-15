export interface TaskDetail {
  startTime?: number;
  endTime?: number;
  computeUnits: number;
  memory: number;
  gpu: boolean;
  cost: number;
  logs: string[];
  model: string;
  // Dataset fields only required for inference mode
  dataset?: string;
  datasetSize?: number;
}

export interface Task {
  id: number;
  name: string;
  model: string;
  type: string;
  mode: "training" | "inference";
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
    model: "GPT-3",
    type: "AI Compute",
    mode: "training",
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
      model: "GPT-3",
      logs: [
        "Initializing model parameters...",
        "Starting training loop...",
        "Epoch 1/10: Loss = 0.234",
        "Epoch 2/10: Loss = 0.198",
        "Epoch 3/10: Loss = 0.167",
        "Epoch 4/10: Loss = 0.145",
        "Epoch 5/10: Loss = 0.132",
      ],
    },
  },
  {
    id: 2,
    name: "Image Generation",
    model: "Stable Diffusion",
    type: "AI Compute",
    mode: "inference",
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
      model: "Stable Diffusion",
      dataset: "Custom Images",
      datasetSize: 1000,
      logs: [
        "Loading dataset: Custom Images...",
        "Dataset loaded successfully",
        "Generating images...",
        "Post-processing...",
        "Task completed successfully",
      ],
    },
  },
  {
    id: 3,
    name: "Text Classification",
    model: "BERT",
    type: "AI Compute",
    mode: "inference",
    status: "queued",
    progress: 0,
    timeLeft: "Waiting",
    created: "2024-06-15",
    details: {
      computeUnits: 1000,
      memory: 4,
      gpu: false,
      cost: 0.5,
      model: "BERT",
      dataset: "IMDB Reviews",
      datasetSize: 50000,
      logs: ["Task queued"],
    },
  },
  {
    id: 4,
    name: "ZK Proof Generation",
    model: "Groth16",
    type: "ZK Compute",
    mode: "training",
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
      model: "Groth16",
      logs: [
        "Initializing ZK circuit...",
        "Generating proof...",
        "Verifying proof...",
        "Proof generated successfully",
      ],
    },
  },
  {
    id: 5,
    name: "Verification",
    model: "Groth16",
    type: "ZK Compute",
    mode: "inference",
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
      model: "Groth16",
      dataset: "Transaction Proofs",
      datasetSize: 500,
      logs: [
        "Loading proofs...",
        "Verifying proofs...",
        "All proofs verified successfully",
      ],
    },
  },
  {
    id: 6,
    name: "MEV Extraction",
    model: "MEV-Bot",
    type: "MEV Optimization",
    mode: "inference",
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
      model: "MEV-Bot",
      dataset: "Recent Transactions",
      datasetSize: 10000,
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
    model: "Arbitrage-Bot",
    type: "MEV Optimization",
    mode: "inference",
    status: "queued",
    progress: 0,
    timeLeft: "Waiting",
    created: "2024-06-15",
    details: {
      computeUnits: 1500,
      memory: 5,
      gpu: false,
      cost: 0.8,
      model: "Arbitrage-Bot",
      dataset: "Market Data",
      datasetSize: 5000,
      logs: ["Task queued"],
    },
  },
  {
    id: 8,
    name: "Blockchain Data Analysis",
    model: "Data-Analyzer",
    type: "Data Processing",
    mode: "training",
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
      model: "Data-Analyzer",
      logs: [
        "Loading blockchain data...",
        "Preprocessing transactions...",
        "Training analysis model...",
      ],
    },
  },
  {
    id: 9,
    name: "Transaction Pattern Recognition",
    model: "Fraud Detector",
    type: "Data Processing",
    mode: "inference",
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
      model: "Fraud Detector",
      dataset: "Historical Transactions",
      datasetSize: 100000,
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
