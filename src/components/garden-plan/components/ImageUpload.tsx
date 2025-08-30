import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUpload: (file: File, previewUrl: string) => void;
  uploadedImage?: { file: File; previewUrl: string } | null;
  onRemoveImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  uploadedImage,
  onRemoveImage
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    onImageUpload(file, previewUrl);
    
    toast({
      title: "Image Uploaded",
      description: "Your garden area image has been uploaded successfully!",
    });
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <Camera className="mr-2 h-5 w-5" />
          Upload Garden Area Photo (Optional)
        </CardTitle>
        <p className="text-sm text-sbtp-brown-600">
          Upload a photo of your garden area to help our AI create a more accurate visual layout plan
        </p>
      </CardHeader>
      <CardContent>
        {!uploadedImage ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-sbtp-green-500 bg-sbtp-green-50'
                : 'border-sbtp-green-300 bg-sbtp-green-25'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-sbtp-green-100 rounded-full">
                <Upload className="h-8 w-8 text-sbtp-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-sbtp-green-800">
                  Upload Garden Area Photo
                </h3>
                <p className="text-sm text-sbtp-brown-600">
                  Drag and drop an image here, or click to browse
                </p>
                <p className="text-xs text-sbtp-brown-500">
                  Supports JPG, PNG, WebP • Max 10MB
                </p>
              </div>

              <Button
                onClick={triggerFileInput}
                className="bg-sbtp-green-500 hover:bg-sbtp-green-600"
                type="button"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={uploadedImage.previewUrl}
                alt="Uploaded garden area"
                className="w-full h-64 object-cover rounded-lg border border-sbtp-green-200"
              />
              <Button
                onClick={onRemoveImage}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-sbtp-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-sbtp-green-600" />
                <span className="text-sm font-medium text-sbtp-green-800">
                  {uploadedImage.file.name}
                </span>
              </div>
              <span className="text-xs text-sbtp-brown-600">
                {(uploadedImage.file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            <div className="p-3 bg-sbtp-blue/10 border border-sbtp-blue/20 rounded-lg">
              <p className="text-sm text-sbtp-blue">
                ✨ Great! Our AI will use this image to create a more accurate garden layout that fits your space.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;