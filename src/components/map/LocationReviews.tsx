import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, ThumbsUp, Edit, Trash2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface LocationReviewsProps {
  locationId: string;
  locationName: string;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  review_text: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    display_name: string | null;
  } | null;
}

export default function LocationReviews({ locationId, locationName }: LocationReviewsProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get current user
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  // Fetch reviews
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['location-reviews', locationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_reviews')
        .select(`
          *,
          profiles!location_reviews_user_id_fkey (username, display_name)
        `)
        .eq('location_id', locationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any as Review[];
    },
  });

  // Fetch user's helpful votes
  const { data: userVotes } = useQuery({
    queryKey: ['user-helpful-votes', locationId, userData?.id],
    queryFn: async () => {
      if (!userData?.id) return [];
      const { data, error } = await supabase
        .from('review_helpful_votes')
        .select('review_id')
        .eq('user_id', userData.id);
      
      if (error) throw error;
      return data.map(v => v.review_id);
    },
    enabled: !!userData?.id,
  });

  // Submit review mutation
  const submitReview = useMutation({
    mutationFn: async () => {
      if (!userData?.id) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('location_reviews')
        .insert({
          location_id: locationId,
          user_id: userData.id,
          rating,
          title: title.trim() || null,
          review_text: reviewText.trim(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-reviews', locationId] });
      setTitle('');
      setReviewText('');
      setRating(5);
      setReviewDialogOpen(false);
      toast.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });

  // Toggle helpful vote
  const toggleHelpful = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!userData?.id) throw new Error('Must be logged in');

      const isVoted = userVotes?.includes(reviewId);

      if (isVoted) {
        const { error } = await supabase
          .from('review_helpful_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', userData.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('review_helpful_votes')
          .insert({
            review_id: reviewId,
            user_id: userData.id,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-reviews', locationId] });
      queryClient.invalidateQueries({ queryKey: ['user-helpful-votes', locationId, userData?.id] });
    },
  });

  // Delete review mutation
  const deleteReview = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('location_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-reviews', locationId] });
      toast.success('Review deleted');
    },
  });

  const handleSubmit = async () => {
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview.mutateAsync();
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-sbtp-green-700">{averageRating}</div>
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(parseFloat(averageRating))
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500">{reviews?.length || 0} reviews</div>
          </div>
        </div>

        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sbtp-green-600 hover:bg-sbtp-green-700">
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Review {locationName}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Star Rating */}
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    />
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="review-title">Title (optional)</Label>
                <Input
                  id="review-title"
                  placeholder="Sum up your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Review Text */}
              <div>
                <Label htmlFor="review-text">Your Review</Label>
                <Textarea
                  id="review-text"
                  placeholder="Share your experience with this location..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={6}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {reviewText.length}/1000 characters
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !reviewText.trim()}
                className="w-full bg-sbtp-green-600 hover:bg-sbtp-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading reviews...</div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-sbtp-green-700">
                      {review.profiles?.display_name || review.profiles?.username}
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
                
                {userData?.id === review.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReview.mutate(review.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {review.title && (
                <div className="font-medium">{review.title}</div>
              )}

              <p className="text-sm text-gray-700 whitespace-pre-line">
                {review.review_text}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleHelpful.mutate(review.id)}
                  disabled={!userData?.id}
                  className={`text-xs ${
                    userVotes?.includes(review.id)
                      ? 'text-sbtp-green-600 hover:text-sbtp-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ThumbsUp className={`h-3 w-3 mr-1 ${userVotes?.includes(review.id) ? 'fill-current' : ''}`} />
                  Helpful {review.helpful_count > 0 && `(${review.helpful_count})`}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this location!
          </div>
        )}
      </div>
    </div>
  );
}
