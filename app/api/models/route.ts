import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";
import { uploadFileToSupabase } from "@/lib/supabase";
import { AuthData } from "@/lib/auth-middleware";

// Tên bucket trong Supabase Storage
const BUCKET_NAME = "models";

// POST /api/models - Upload model mới
export const POST = withAuth(async (req: NextRequest, _: any, authData: AuthData) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    
    if (!file || !name) {
      return NextResponse.json(
        { error: "File và tên model là bắt buộc" },
        { status: 400 }
      );
    }
    
    // Tạo đường dẫn file độc đáo
    const uniqueFileName = `${authData.user.id}/${Date.now()}-${file.name}`;
    
    // Upload file lên Supabase
    const fileUrl = await uploadFileToSupabase(file, BUCKET_NAME, uniqueFileName);
    
    // Tạo record trong database
    const model = await prisma.model.create({
      data: {
        name,
        description,
        filePath: fileUrl, // Lưu URL của file thay vì đường dẫn cục bộ
        fileSize: file.size,
        fileType: file.type,
        userId: authData.user.id
      }
    });
    
    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error("Error uploading model:", error);
    return NextResponse.json(
      { error: "Failed to upload model" },
      { status: 500 }
    );
  }
});

// GET /api/models - Lấy tất cả models của người dùng
export const GET = withAuth(async (req: NextRequest, _: any, authData: AuthData) => {
  const models = await prisma.model.findMany({
    where: {
      userId: authData.user.id
    }
  });
  
  return NextResponse.json(models);
}); 