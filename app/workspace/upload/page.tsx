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
import { Upload, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";

// Mock data for user's models
const initialModels = [
  {
    id: 1,
    name: "Image Classifier",
    type: "Vision",
    date: "2024-06-15",
    status: "active",
  },
  {
    id: 2,
    name: "Text Summarizer",
    type: "NLP",
    date: "2024-06-10",
    status: "pending",
  },
  {
    id: 3,
    name: "Fraud Detector",
    type: "Finance",
    date: "2024-05-30",
    status: "error",
  },
];

export default function ModelPage() {
  const [models, setModels] = useState(initialModels);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-[#00E5FF]" />;
      case "pending":
        return <Clock className="h-4 w-4 text-[#00FFA3]" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-[#A374FF]" />;
      default:
        return null;
    }
  };

  const handleUpload = () => {
    if (!uploadName || !uploadType || !uploadFile) return;
    setModels([
      ...models,
      {
        id: models.length + 1,
        name: uploadName,
        type: uploadType,
        date: new Date().toISOString().slice(0, 10),
        status: "pending",
      },
    ]);
    setIsDialogOpen(false);
    setUploadName("");
    setUploadType("");
    setUploadFile(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
          My Models
        </h1>
        <Button
          className="bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-white hover:opacity-90 flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Upload className="h-5 w-5" />
          Upload Model
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="bg-black/50 border-[#A374FF]/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                {getStatusIcon(model.status)}
                {model.name}
              </CardTitle>
              <span className="text-xs text-gray-400">{model.type}</span>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Date: {model.date}</span>
                <span className="capitalize">{model.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-[#A374FF]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
              Upload Model
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Model Name"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="bg-black/30 border-[#A374FF]/20 text-white"
            />
            <Input
              placeholder="Model Type (e.g. Vision, NLP, ... )"
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="bg-black/30 border-[#A374FF]/20 text-white"
            />
            <input
              type="file"
              accept=".pt,.onnx,.h5,.pb,.zip,.tar,.tar.gz"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="text-gray-300"
            />
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
              onClick={handleUpload}
              disabled={!uploadName || !uploadType || !uploadFile}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
