"use client";

import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@solana/wallet-adapter-react";

interface Model {
  id: string;
  name: string;
  type: string;
  status: string;
  framework?: string;
  description?: string;
  createdAt: string;
}

export default function ModelPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState("");
  const [uploadFramework, setUploadFramework] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { publicKey } = useWallet();

  const fetchModels = async () => {
    if (!publicKey) return;

    try {
      const response = await fetch(
        `/api/models?wallet=${publicKey.toBase58()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }
      const data = await response.json();
      setModels(data.models);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [publicKey]);

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

  const handleUpload = async () => {
    if (!uploadName || !uploadType || !uploadFile || !publicKey) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("name", uploadName);
      formData.append("type", uploadType);
      formData.append("framework", uploadFramework);
      formData.append("description", uploadDescription);
      formData.append("wallet", publicKey.toBase58());

      const response = await fetch("/api/models/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { model } = await response.json();
      setModels([model, ...models]);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading model:", error);
      // You might want to show an error toast/notification here
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setUploadName("");
    setUploadType("");
    setUploadFramework("");
    setUploadDescription("");
    setUploadFile(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
          My Models
        </h1>
        <Button
          className="bg-[#0d2341] text-gray-200 border border-[#1a2b44] hover:bg-[#1a2b44] flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
          disabled={!publicKey}
        >
          <Upload className="h-5 w-5" />
          Upload Model
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center items-center py-12">
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-[#00E5FF]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-400">Loading models...</span>
            </div>
          </div>
        ) : models.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-400">
              {publicKey
                ? "No models uploaded yet"
                : "Connect your wallet to view models"}
            </p>
          </div>
        ) : (
          models.map((model) => (
            <Card
              key={model.id}
              className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-gray-200 flex items-center gap-2">
                  {model.name}
                </CardTitle>
                <span className="text-xs text-gray-400">{model.type}</span>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {model.framework && (
                    <p className="text-sm text-gray-400">
                      Framework: {model.framework}
                    </p>
                  )}
                  {model.description && (
                    <p className="text-sm text-gray-400">{model.description}</p>
                  )}
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>
                      Created: {new Date(model.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0A1A2F] border-[#1a2b44] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-400">
              Upload New Model
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Model Name"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
            />
            <Input
              placeholder="Model Type (e.g. Vision, NLP)"
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
            />
            <Input
              placeholder="Framework (optional, e.g. PyTorch, TensorFlow)"
              value={uploadFramework}
              onChange={(e) => setUploadFramework(e.target.value)}
              className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
            />
            <Textarea
              placeholder="Description (optional)"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              className="bg-[#0d2341] border-[#1a2b44] text-gray-200 placeholder-gray-400"
            />
            <input
              type="file"
              accept=".pt,.onnx,.h5,.pb,.zip,.tar,.tar.gz"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="text-gray-400"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-[#0d2341] text-gray-200 border-[#1a2b44] hover:bg-[#1a2b44]"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#0d2341] text-gray-200 border border-[#1a2b44] hover:bg-[#1a2b44]"
              onClick={handleUpload}
              disabled={
                !uploadName || !uploadType || !uploadFile || isUploading
              }
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
