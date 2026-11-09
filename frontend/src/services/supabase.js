import { createClient } from '@supabase/supabase-js';

// Environment variable retrieval compatible with Next.js webpack & browser bundle
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  'https://hzalojkkghsxwbdflkyk.supabase.co';

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YWxvamtrZ2hzeHdiZGZsa3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNDMzNDYsImV4cCI6MjEwOTYxOTM0Nn0.7JR-wGzKXEZHxPE_U452hqDTNtGTtSizS52DB16m4cI';

export const photoBucketName = 
  process.env.NEXT_PUBLIC_STORAGE_BUCKET_PHOTOS || 
  process.env.VITE_STORAGE_BUCKET_PHOTOS || 
  'photos';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload an image file to Supabase Storage photos bucket
 */
export async function uploadIncidentPhoto(file, userId = 'anonymous') {
  if (!file) throw new Error('No file provided');
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(photoBucketName)
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from(photoBucketName)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
