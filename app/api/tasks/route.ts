import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { walletAddress, ...taskData } = data;

    // Find or create wallet
    const wallet = await prisma.wallet.upsert({
      where: { address: walletAddress },
      update: {},
      create: {
        address: walletAddress,
      },
    });

    // Create task with wallet relation
    const task = await prisma.task.create({
      data: {
        name: taskData.name,
        type: taskData.type,
        numGpus: taskData.numGpus,
        vcpuPerGpu: taskData.vcpuPerGpu,
        ramPerGpu: taskData.ramPerGpu,
        diskSize: taskData.diskSize,
        model: taskData.model,
        scriptPath: taskData.scriptPath,
        installCommand: taskData.installCommand,
        runCommand: taskData.runCommand,
        walletId: wallet.id,
        status: "created",
      },
      include: {
        wallet: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("wallet");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        wallet: {
          address: walletAddress,
        },
      },
      include: {
        wallet: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
