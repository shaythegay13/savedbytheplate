import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, X, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface LocationPhotosProps {
  locationId: string;
  locationName: string;
}

interface Photo {
  id: string;
  user_id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
  profiles: {
    username: string;
    display_name: string | null;
  };
}

export default function LocationPhotos({ locationId, locationName }: LocationPhotosProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const queryClient = useQueryClient();

  // Get current user
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  // Fetch photos
  const { data: photos, isLoading } = useQuery({
    queryKey: ['location-photos', locationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_photos')
        .select(`
          *,
          profiles (username, display_name)
        `)
        .eq('location_id', locationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Photo[];
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload photo mutation
  const uploadPhoto = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !userData?.id) throw new Error('Missing file or user');

      // Upload to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userData.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('location-photos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('location_photos')
        .insert({
          location_id: locationId,
          user_id: userData.id,
          storage_path: fileName,
          caption: caption.trim() || null,
        });

      if (dbError) {
        // Cleanup uploaded file if database insert fails
        await supabase.storage.from('location-photos').remove([fileName]);
        throw dbError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-photos', locationId] });
      setSelectedFile(null);
      setCaption('');
      setPreviewUrl(null);
      setUploadDialogOpen(false);
      toast.success('Photo uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload photo');
    },
  });

  // Delete photo mutation
  const deletePhoto = useMutation({
    mutationFn: async (photo: Photo) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('location-photos')
        .remove([photo.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('location_photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-photos', locationId] });
      toast.success('Photo deleted');
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a photo');
      return;
    }

    setIsUploading(true);
    try {
      await uploadPhoto.mutateAsync();
    } finally {
      setIsUploading(false);
    }
  };

  const getPhotoUrl = (path: string) => {
    const { data } = supabase.storage
      .from('location-photos')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-sbtp-green-700">
          Photos ({photos?.length || 0})
        </h3>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sbtp-green-600 hover:bg-sbtp-green-700">
              <Camera className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Photo to {locationName}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* File Input */}
              <div>
                <Label htmlFor="photo-upload">Select Photo</Label>
                <div className="mt-2">
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sbtp-green-400 transition-colors"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload photo</p>
                        <p className="text-xs text-gray-400">PNG, JPG, WEBP (max 5MB)</p>
                      </div>
                    )}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <Label htmlFor="photo-caption">Caption (optional)</Label>
                <Input
                  id="photo-caption"
                  placeholder="Describe this photo..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={200}
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className="w-full bg-sbtp-green-600 hover:bg-sbtp-green-700"
              >
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Photos Grid */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading photos...</div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer rounded-lg overflow-hidden"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={getPhotoUrl(photo.storage_path)}
                alt={photo.caption || 'Location photo'}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-end p-2">
                <div className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  By {photo.profiles?.display_name || photo.profiles?.username}
                </div>
              </div>
              
              {userData?.id === photo.user_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePhoto.mutate(photo);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No photos yet. Be the first to share a photo of this location!
        </div>
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Photo by {selectedPhoto.profiles?.display_name || selectedPhoto.profiles?.username}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={getPhotoUrl(selectedPhoto.storage_path)}
                alt={selectedPhoto.caption || 'Location photo'}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              {selectedPhoto.caption && (
                <p className="text-gray-700">{selectedPhoto.caption}</p>
              )}
              <p className="text-xs text-gray-500">
                Uploaded {format(new Date(selectedPhoto.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
