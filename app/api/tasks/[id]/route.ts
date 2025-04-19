import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";
import { AuthData } from "@/lib/auth-middleware";
import { TaskStatus } from "@prisma/client";

// GET /api/tasks/[id] - Lấy thông tin chi tiết của một task
export const GET = withAuth(async (req: NextRequest, { params }: { params: { id: string } }, authData: AuthData) => {
  const taskId = params.id;
  
  const task = await prisma.task.findUnique({
    where: {
      id: taskId
    },
    include: {
      model: true
    }
  });
  
  if (!task) {
    return NextResponse.json(
      { error: "Task không tồn tại" },
      { status: 404 }
    );
  }
  
  // Kiểm tra quyền sở hữu
  if (task.userId !== authData.user.id) {
    return NextResponse.json(
      { error: "Không có quyền truy cập task này" },
      { status: 403 }
    );
  }
  
  return NextResponse.json(task);
});

// PUT /api/tasks/[id] - Cập nhật thông tin của task
export const PUT = withAuth(async (req: NextRequest, { params }: { params: { id: string } }, authData: AuthData) => {
  const taskId = params.id;
  const { name, description, status, result } = await req.json();
  
  // Tìm task
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });
  
  if (!task) {
    return NextResponse.json(
      { error: "Task không tồn tại" },
      { status: 404 }
    );
  }
  
  // Kiểm tra quyền sở hữu
  if (task.userId !== authData.user.id) {
    return NextResponse.json(
      { error: "Không có quyền cập nhật task này" },
      { status: 403 }
    );
  }
  
  // Validate status nếu cần cập nhật
  if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
    return NextResponse.json(
      { error: "Trạng thái không hợp lệ" },
      { status: 400 }
    );
  }
  
  // Cập nhật task
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      name: name !== undefined ? name : undefined,
      description: description !== undefined ? description : undefined,
      status: status !== undefined ? status as TaskStatus : undefined,
      result: result !== undefined ? JSON.stringify(result) : undefined
    }
  });
  
  return NextResponse.json(updatedTask);
});

// DELETE /api/tasks/[id] - Xóa task
export const DELETE = withAuth(async (req: NextRequest, { params }: { params: { id: string } }, authData: AuthData) => {
  const taskId = params.id;
  
  // Tìm task
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });
  
  if (!task) {
    return NextResponse.json(
      { error: "Task không tồn tại" },
      { status: 404 }
    );
  }
  
  // Kiểm tra quyền sở hữu
  if (task.userId !== authData.user.id) {
    return NextResponse.json(
      { error: "Không có quyền xóa task này" },
      { status: 403 }
    );
  }
  
  // Không cho phép xóa task đang xử lý
  if (task.status === "PROCESSING") {
    return NextResponse.json(
      { error: "Không thể xóa task đang xử lý" },
      { status: 400 }
    );
  }
  
  // Xóa task
  await prisma.task.delete({
    where: { id: taskId }
  });
  
  return new NextResponse(null, { status: 204 });
}); 