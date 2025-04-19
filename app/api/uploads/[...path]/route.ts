import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { supabase } from "@/lib/supabase";

// GET /api/uploads/[...path] - Trả về file từ Supabase Storage
export const GET = withAuth(async (req: NextRequest, context: { params: { path: string[] } }) => {
  try {
    const { path } = context.params;
    const bucketName = path[0]; // Bucket là phần đầu tiên của path
    const filePathWithoutBucket = path.slice(1).join('/'); // Phần còn lại là đường dẫn file
    
    // Lấy file từ Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePathWithoutBucket);
    
    if (error || !data) {
      console.error("Error downloading file from Supabase:", error);
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
    
    // Chuyển đổi thành ArrayBuffer
    const buffer = await data.arrayBuffer();
    
    // Xác định content type dựa vào phần mở rộng
    const fileName = path[path.length - 1];
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    
    let contentType = 'application/octet-stream';
    
    if (fileExtension === 'pdf') contentType = 'application/pdf';
    else if (['jpg', 'jpeg'].includes(fileExtension)) contentType = 'image/jpeg';
    else if (fileExtension === 'png') contentType = 'image/png';
    else if (fileExtension === 'svg') contentType = 'image/svg+xml';
    else if (fileExtension === 'json') contentType = 'application/json';
    
    // Trả về file với content type phù hợp
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }
}); 