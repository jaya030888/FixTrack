import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const photoBucketName = import.meta.env.VITE_STORAGE_BUCKET_PHOTOS || 'photos';

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

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
