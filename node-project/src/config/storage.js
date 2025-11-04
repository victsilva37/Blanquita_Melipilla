const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const BUCKET_NAME = process.env.BUCKET_NAME;

// --- Subir archivo al bucket ---
async function uploadFileToBucket(file) {
  if (!file) return null;

  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = `productos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
}

module.exports = { uploadFileToBucket };
