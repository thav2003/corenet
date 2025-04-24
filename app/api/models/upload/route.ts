import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const framework = formData.get("framework") as string;
    const description = formData.get("description") as string;
    const walletAddress = formData.get("wallet") as string;

    if (!file || !name || !type || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create models directory if it doesn't exist
    const modelsDir = join(process.cwd(), "public/models");
    await mkdir(modelsDir, { recursive: true });

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const uniqueFilename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = join(modelsDir, uniqueFilename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const wallet = await prisma.wallet.findUnique({
      where: {
        address: walletAddress,
      },
    });
    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }
    // Create model record in database
    const model = await prisma.model.create({
      data: {
        name,
        type,
        framework,
        description,
        filePath: `/models/${uniqueFilename}`,
        fileSize: buffer.length,
        status: "pending",
        walletId: wallet.id,
      },
    });

    return NextResponse.json({
      success: true,
      model: {
        id: model.id,
        name: model.name,
        type: model.type,
        status: model.status,
        framework: model.framework,
        description: model.description,
        createdAt: model.createdAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading model" },
      { status: 500 }
    );
  }
}
