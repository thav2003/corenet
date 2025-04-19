import { createClient } from '@supabase/supabase-js';

// Lấy thông tin kết nối từ biến môi trường
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Tạo Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper để lưu file lên Supabase Storage
export async function uploadFileToSupabase(
  file: File | Buffer,
  bucketName: string,
  filePath: string
): Promise<string> {
  try {
    let fileData: Buffer;
    let fileName: string;
    
    // Chuyển đổi File thành Buffer nếu cần
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileData = Buffer.from(arrayBuffer);
      fileName = file.name;
    } else {
      fileData = file;
      // Lấy tên file từ đường dẫn
      fileName = filePath.split('/').pop() || 'file';
    }
    
    // Upload file lên Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileData, {
        contentType: file instanceof File ? file.type : 'application/octet-stream',
        upsert: true,
      });
    
    if (error) {
      throw error;
    }
    
    // Lấy URL công khai của file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
} 