import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const removeBackground = async (
  imageElement: HTMLImageElement
): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');
    const segmenter = await pipeline(
      'image-segmentation',
      'Xenova/segformer-b0-finetuned-ade-512-512',
      {
        device: 'webgpu',
      }
    );

    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(
      `Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`
    );

    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');

    // Process the image with the segmentation model
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);

    console.log('Segmentation result:', result);

    if (
      !result ||
      !Array.isArray(result) ||
      result.length === 0 ||
      !result[0].mask
    ) {
      throw new Error('Invalid segmentation result');
    }

    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');

    if (!outputCtx) throw new Error('Could not get output canvas context');

    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);

    // Apply the mask
    const outputImageData = outputCtx.getImageData(
      0,
      0,
      outputCanvas.width,
      outputCanvas.height
    );
    const data = outputImageData.data;

    // Apply inverted mask to alpha channel
    for (let i = 0; i < result[0].mask.data.length; i++) {
      // Invert the mask value (1 - value) to keep the subject instead of the background
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }

    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Mask applied successfully');

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Simple checkerboard removal for images with baked-in checkerboard pattern
export const removeCheckerboardBackground = async (
  imageElement: HTMLImageElement
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.drawImage(imageElement, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Checkerboard colors (light gray and white squares)
  const isCheckerboardPixel = (r: number, g: number, b: number): boolean => {
    // Light gray squares: approximately rgb(204, 204, 204) or #ccc
    const isLightGray = Math.abs(r - 204) < 15 && Math.abs(g - 204) < 15 && Math.abs(b - 204) < 15;
    // White squares: approximately rgb(255, 255, 255) or near-white
    const isWhite = r > 240 && g > 240 && b > 240;
    // Also check for the typical checkerboard pattern colors
    const isGray1 = Math.abs(r - 192) < 20 && Math.abs(g - 192) < 20 && Math.abs(b - 192) < 20;
    const isGray2 = Math.abs(r - 224) < 20 && Math.abs(g - 224) < 20 && Math.abs(b - 224) < 20;
    
    return isLightGray || isWhite || isGray1 || isGray2;
  };
  
  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    if (isCheckerboardPixel(r, g, b)) {
      // Set alpha to 0 (transparent)
      data[i + 3] = 0;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return canvas.toDataURL('image/png');
};
