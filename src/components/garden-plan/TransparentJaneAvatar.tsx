import { useState, useEffect, useRef } from 'react';
import janeAvatarOriginal from '@/assets/jane-avatar.png';

interface TransparentJaneAvatarProps {
  className?: string;
  alt?: string;
}

const TransparentJaneAvatar = ({ className = '', alt = 'Jane - Your Garden Assistant' }: TransparentJaneAvatarProps) => {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            setProcessedSrc(janeAvatarOriginal);
            setIsProcessing(false);
            return;
          }
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Detect and remove checkerboard pattern
          // Checkerboard colors are typically light gray (~204,204,204) and white (~255,255,255)
          const isCheckerboardPixel = (r: number, g: number, b: number): boolean => {
            // Check for near-white pixels (the white squares)
            if (r > 245 && g > 245 && b > 245) return true;
            
            // Check for light gray squares (typically around 192-224)
            const isGray = Math.abs(r - g) < 5 && Math.abs(g - b) < 5 && Math.abs(r - b) < 5;
            if (isGray && r > 180 && r < 230) return true;
            
            return false;
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
          setProcessedSrc(canvas.toDataURL('image/png'));
          setIsProcessing(false);
        };
        
        img.onerror = () => {
          setProcessedSrc(janeAvatarOriginal);
          setIsProcessing(false);
        };
        
        img.src = janeAvatarOriginal;
      } catch (error) {
        console.error('Error processing image:', error);
        setProcessedSrc(janeAvatarOriginal);
        setIsProcessing(false);
      }
    };
    
    processImage();
  }, []);

  if (isProcessing) {
    return (
      <div className={`${className} bg-green-100/50 animate-pulse rounded-2xl`} />
    );
  }

  return (
    <img 
      src={processedSrc || janeAvatarOriginal}
      alt={alt}
      className={className}
    />
  );
};

export default TransparentJaneAvatar;
