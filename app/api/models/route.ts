import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("wallet");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        address: walletAddress,
      },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const models = await prisma.model.findMany({
      where: {
        walletId: wallet.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      models: models.map((model) => ({
        id: model.id,
        name: model.name,
        type: model.type,
        status: model.status,
        framework: model.framework,
        description: model.description,
        createdAt: model.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Error fetching models" },
      { status: 500 }
    );
  }
}
