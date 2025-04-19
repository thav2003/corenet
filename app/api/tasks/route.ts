import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";
import { AuthData } from "@/lib/auth-middleware";
import { TaskType } from "@prisma/client";

// GET /api/tasks - Lấy tất cả tasks của người dùng
export const GET = withAuth(async (req: NextRequest, _: any, authData: AuthData) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId: authData.user.id
    },
    include: {
      model: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return NextResponse.json(tasks);
});

// POST /api/tasks - Tạo task mới
export const POST = withAuth(async (req: NextRequest, _: any, authData: AuthData) => {
  try {
    const { name, description, type, params, modelId } = await req.json();
    
    // Validate yêu cầu
    if (!name || !type) {
      return NextResponse.json(
        { error: "Tên và loại task là bắt buộc" },
        { status: 400 }
      );
    }
    
    // Kiểm tra loại task hợp lệ
    if (![TaskType.TRAINING, TaskType.USE].includes(type)) {
      return NextResponse.json(
        { error: "Loại task không hợp lệ" },
        { status: 400 }
      );
    }
    
    // Nếu là task USE, phải có modelId
    if (type === TaskType.USE && !modelId) {
      return NextResponse.json(
        { error: "ModelId là bắt buộc cho task USE" },
        { status: 400 }
      );
    }
    
    // Kiểm tra quyền sở hữu model nếu modelId được cung cấp
    if (modelId) {
      const model = await prisma.model.findUnique({
        where: { id: modelId }
      });
      
      if (!model) {
        return NextResponse.json(
          { error: "Model không tồn tại" },
          { status: 404 }
        );
      }
      
      if (model.userId !== authData.user.id) {
        return NextResponse.json(
          { error: "Không có quyền sử dụng model này" },
          { status: 403 }
        );
      }
    }
    
    // Tạo task mới
    const task = await prisma.task.create({
      data: {
        name,
        description,
        type: type as TaskType,
        params: params ? JSON.stringify(params) : null,
        modelId: modelId || null,
        userId: authData.user.id,
        walletId: authData.wallet.id,
        status: "PENDING"
      }
    });
    
    // TODO: Gửi task đến worker để xử lý (có thể thông qua queue hoặc event)
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}); 