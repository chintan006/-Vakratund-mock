/**
 * Reads an uploaded/dropped/pasted image File and compresses/scales it cleanly
 * using an offscreen canvas so high-resolution phone camera photos of handwritten
 * notebook pages remain crisp while fitting comfortably in browser storage.
 */
export function processHandwrittenImageFile(
  file: File
): Promise<{ dataUrl: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const rawResult = reader.result as string;
      const img = new Image();
      img.onerror = () =>
        resolve({ dataUrl: rawResult, fileName: file.name });
      img.onload = () => {
        const maxDimension = 1280;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: rawResult, fileName: file.name });
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);
        resolve({ dataUrl: compressedDataUrl, fileName: file.name });
      };
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  });
}
