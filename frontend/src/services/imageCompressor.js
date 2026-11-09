/**
 * Browser-side Image Compression Utility
 * Resizes large images (e.g. 10MB+ phone camera shots) to a max dimension of 1280px
 * and compresses them to JPEG (quality ~0.75-0.80).
 * Results in ~200KB-400KB files for sub-second uploads and faster AI inference.
 */
export async function compressImage(file, maxWidth = 1280, maxHeight = 1280, quality = 0.8) {
  if (!file || !file.type.startsWith('image/')) {
    return file;
  }

  // If already under 400KB, skip resizing
  if (file.size < 400 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // fallback to original
              return;
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            console.log(`📸 Image compressed: ${(file.size / 1024).toFixed(0)}KB ➡️ ${(compressedFile.size / 1024).toFixed(0)}KB`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

