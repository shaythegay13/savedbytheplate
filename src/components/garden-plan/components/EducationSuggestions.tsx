import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, Download, Clock, Play, FileText, Star, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EducationSuggestionsProps {
  plantRecommendations?: any[];
}

const EducationSuggestions: React.FC<EducationSuggestionsProps> = ({ plantRecommendations = [] }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducationResources();
  }, [plantRecommendations]);

  const fetchEducationResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-education-resources', {
        body: { 
          plantRecommendations,
          limit: 6 
        }
      });

      if (error) {
        console.error('Error fetching education resources:', error);
        return;
      }

      setArticles(data?.articles?.slice(0, 6) || []);
      setVideos(data?.videos?.slice(0, 6) || []);
      setCourses(data?.courses?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching education resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center border-4 border-white rounded-lg p-6 bg-gradient-to-br from-sbtp-blue-50 to-sbtp-green-50 shadow-lg mb-6">
        <h2 className="text-3xl font-bold text-sbtp-green-800 mb-2 flex items-center justify-center gap-3">
          <span className="text-4xl">🎓</span>
          Ready to Upskill?
          <span className="text-4xl">📚</span>
        </h2>
        <p className="text-sbtp-brown-600 text-lg">
          Discover real-world resources to master the gardening skills you need for your personalized plan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="mr-2 h-5 w-5" />
              Recommended Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <div className="h-16 bg-muted animate-pulse rounded"></div>
                <div className="h-16 bg-muted animate-pulse rounded"></div>
              </div>
            ) : (
              articles.map((article, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 relative cursor-pointer hover:bg-muted/50 rounded p-2 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm mb-1">{article.title}</h4>
                    <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{article.source}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  {article.url && (
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0"></a>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Video className="mr-2 h-5 w-5" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <div className="h-16 bg-muted animate-pulse rounded"></div>
                <div className="h-16 bg-muted animate-pulse rounded"></div>
              </div>
            ) : (
              videos.map((video, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 relative cursor-pointer hover:bg-muted/50 rounded p-2 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm mb-1">{video.title}</h4>
                    <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">By {video.channel}</span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Play className="h-3 w-3 mr-1" />
                      {video.duration}
                    </div>
                  </div>
                  <Badge variant={video.difficulty === 'Beginner' ? 'secondary' : 'default'}>
                    {video.difficulty}
                  </Badge>
                  {video.url && (
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0"></a>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <div className="h-20 bg-muted animate-pulse rounded"></div>
                <div className="h-20 bg-muted animate-pulse rounded"></div>
              </div>
            ) : (
              courses.map((course, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 relative cursor-pointer hover:bg-muted/50 rounded p-2 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm">{course.title}</h4>
                    <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{course.institution}</p>
                  <p className="text-xs text-muted-foreground mb-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={course.price === 'Paid' ? 'default' : 'secondary'}>
                      {course.price}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{course.duration}</span>
                  </div>
                  {course.url && (
                    <a href={course.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0"></a>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducationSuggestions;