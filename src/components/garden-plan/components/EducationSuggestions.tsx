import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, Download, Clock, Play, FileText, Star } from 'lucide-react';

const EducationSuggestions: React.FC = () => {
  const suggestedArticles = [
    {
      title: "Container Gardening in Small NYC Apartments",
      excerpt: "Maximize your growing potential with these space-saving container gardening techniques perfect for NYC living.",
      readTime: "8 min read",
      category: "Urban Gardening"
    },
    {
      title: "Seasonal Growing Guide for Zone 7a",
      excerpt: "A complete month-by-month guide to growing vegetables in New York's climate zone.",
      readTime: "12 min read",
      category: "Seasonal Guides"
    }
  ];

  const suggestedVideos = [
    {
      title: "Setting Up Your First Balcony Garden",
      duration: "15:30",
      instructor: "Garden Expert Maria",
      difficulty: "Beginner"
    },
    {
      title: "Advanced Companion Planting Techniques",
      duration: "22:15",
      instructor: "Dr. Plant Science",
      difficulty: "Advanced"
    }
  ];

  const suggestedCourses = [
    {
      title: "Advanced Container Gardening",
      description: "Master techniques for maximizing yields in small containers and urban spaces.",
      duration: "2 hours",
      type: "Premium"
    },
    {
      title: "Introduction to Urban Gardening",
      description: "Learn the basics of starting your own urban garden in small spaces.",
      duration: "45 minutes",
      type: "Free"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Continue Learning</h2>
        <p className="text-muted-foreground mb-6">
          Enhance your gardening knowledge with these recommended resources
        </p>
        <Button asChild variant="outline" className="mb-8">
          <Link to="/education">
            <BookOpen className="mr-2 h-4 w-4" />
            View All Education Resources
          </Link>
        </Button>
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
            {suggestedArticles.map((article, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h4 className="font-medium text-sm mb-1">{article.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            ))}
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
            {suggestedVideos.map((video, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h4 className="font-medium text-sm mb-1">{video.title}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">By {video.instructor}</span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Play className="h-3 w-3 mr-1" />
                    {video.duration}
                  </div>
                </div>
                <Badge className={video.difficulty === 'Beginner' ? 'bg-green-500' : 'bg-blue-500'}>
                  {video.difficulty}
                </Badge>
              </div>
            ))}
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
            {suggestedCourses.map((course, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-sm">{course.title}</h4>
                  {course.type === 'Premium' && <Star className="h-3 w-3 text-yellow-500" />}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant={course.type === 'Premium' ? 'default' : 'secondary'}>
                    {course.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{course.duration}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducationSuggestions;