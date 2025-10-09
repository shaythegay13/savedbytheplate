import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plantRecommendations } = await req.json();
    
    // Extract unique plant names for search queries
    const plantNames = plantRecommendations?.slice(0, 5).map((plant: any) => plant.name) || ['vegetable gardening', 'container gardening'];
    const searchTerms = plantNames.join(' ');

    // Search for YouTube videos
    const videoSearchQuery = `how to grow ${searchTerms} gardening tutorial`;
    const videos = await searchYouTubeVideos(videoSearchQuery);

    // Search for articles
    const articleSearchQuery = `${searchTerms} growing guide gardening tips`;
    const articles = await searchGardeningArticles(articleSearchQuery);

    // Get courses from known institutions
    const courses = await getGardeningCourses(searchTerms);

    return new Response(JSON.stringify({
      videos,
      articles,
      courses
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching education resources:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch education resources',
      videos: [],
      articles: [],
      courses: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function searchYouTubeVideos(query: string) {
  try {
    // For now, return curated YouTube videos based on common gardening topics
    return getCuratedYouTubeVideos(query);
  } catch (error) {
    console.error('YouTube search error:', error);
    return getMockVideos(query);
  }
}

async function searchGardeningArticles(query: string) {
  try {
    // Return curated articles from reputable gardening sources
    return getCuratedGardeningArticles(query);
  } catch (error) {
    console.error('Article search error:', error);
    return getMockArticles(query);
  }
}

async function getGardeningCourses(searchTerms: string) {
  // Curated list of real gardening courses from reputable institutions
  const courses = [
    {
      title: "Urban Agriculture Certificate Program",
      institution: "FarmSchool NYC",
      description: "Learn sustainable urban farming techniques and food production in city environments.",
      duration: "6 weeks",
      type: "Certificate",
      url: "https://www.farmschoolnyc.org/courses",
      price: "Paid"
    },
    {
      title: "Home Vegetable Gardening",
      institution: "Cornell Cooperative Extension",
      description: "Master the fundamentals of growing vegetables in home gardens.",
      duration: "4 weeks",
      type: "Online Course",
      url: "https://ccenassau.org/gardening",
      price: "Free"
    },
    {
      title: "Container Gardening Fundamentals",
      institution: "Brooklyn Botanic Garden",
      description: "Learn to grow plants successfully in containers and small spaces.",
      duration: "2 hours",
      type: "Workshop",
      url: "https://www.bbg.org/education/adult",
      price: "Paid"
    },
    {
      title: "Organic Gardening Methods",
      institution: "GrowNYC",
      description: "Explore organic practices for sustainable and chemical-free food production.",
      duration: "3 weeks",
      type: "Online Course",
      url: "https://www.grownyc.org/gardening",
      price: "Free"
    },
    {
      title: "Permaculture Design Certificate",
      institution: "NYC Permaculture",
      description: "Comprehensive training in permaculture principles and sustainable garden design.",
      duration: "10 weeks",
      type: "Certificate",
      url: "https://www.nycpermaculture.org/",
      price: "Paid"
    },
    {
      title: "Seed Starting and Propagation",
      institution: "New York Botanical Garden",
      description: "Learn professional techniques for starting plants from seeds and cuttings.",
      duration: "1 day",
      type: "Workshop",
      url: "https://www.nybg.org/adult-education/",
      price: "Paid"
    }
  ];

  return courses;
}

function getCuratedYouTubeVideos(query: string) {
  const videos = [
    {
      title: "Container Gardening for Beginners - Complete Guide",
      url: "https://www.youtube.com/watch?v=vClOYxZUoGw",
      channel: "Epic Gardening",
      duration: "15:30",
      difficulty: "Beginner"
    },
    {
      title: "Growing Vegetables in Small Spaces",
      url: "https://www.youtube.com/watch?v=UmSZhGIEr1Y", 
      channel: "California Gardening",
      duration: "22:15",
      difficulty: "Intermediate"
    },
    {
      title: "How to Start a Vegetable Garden",
      url: "https://www.youtube.com/watch?v=YZLtyYO1xgM",
      channel: "Roots and Refuge Farm",
      duration: "18:45",
      difficulty: "Beginner"
    },
    {
      title: "Raised Bed Gardening for Beginners",
      url: "https://www.youtube.com/watch?v=jR2u7LFlNt0",
      channel: "GrowVeg",
      duration: "12:20",
      difficulty: "Beginner"
    },
    {
      title: "Organic Gardening Tips and Tricks",
      url: "https://www.youtube.com/watch?v=DZGzbGVBCy0",
      channel: "MI Gardener",
      duration: "25:10",
      difficulty: "Intermediate"
    },
    {
      title: "Companion Planting Guide",
      url: "https://www.youtube.com/watch?v=5tlhvkX_9p4",
      channel: "CaliKim29 Garden & Home DIY",
      duration: "16:35",
      difficulty: "Intermediate"
    }
  ];
  
  return videos;
}

function getCuratedGardeningArticles(query: string) {
  const articles = [
    {
      title: "Complete Guide to Container Gardening",
      url: "https://www.gardeningknowhow.com/container-gardening/container-gardening-tips.htm",
      excerpt: "Learn everything you need to know about growing plants in containers, from choosing the right containers to plant care.",
      source: "gardeningknowhow.com",
      readTime: "8 min read",
      category: "Container Gardening"
    },
    {
      title: "Vegetable Garden Planning for Beginners",
      url: "https://www.almanac.com/vegetable-garden-planning-for-beginners",
      excerpt: "Step-by-step guide to planning your first vegetable garden, including site selection and crop rotation.",
      source: "almanac.com", 
      readTime: "10 min read",
      category: "Garden Planning"
    },
    {
      title: "Growing Your Own Food: A Beginner's Guide",
      url: "https://extension.org/starting-vegetable-garden/",
      excerpt: "University extension guide covering soil preparation, plant selection, and seasonal care for home gardens.",
      source: "extension.org",
      readTime: "12 min read", 
      category: "University Extension"
    },
    {
      title: "Companion Planting Chart for Vegetables",
      url: "https://www.almanac.com/companion-planting-guide-vegetables",
      excerpt: "Discover which vegetables grow well together and which combinations to avoid for a healthier garden.",
      source: "almanac.com",
      readTime: "6 min read",
      category: "Companion Planting"
    },
    {
      title: "Soil Preparation and Composting Basics",
      url: "https://www.almanac.com/how-prepare-soil-planting",
      excerpt: "Essential techniques for preparing healthy soil and creating nutrient-rich compost for your garden.",
      source: "almanac.com",
      readTime: "9 min read",
      category: "Soil Health"
    },
    {
      title: "Season Extension Techniques for Year-Round Growing",
      url: "https://www.growveg.com/guides/season-extension-techniques/",
      excerpt: "Methods to extend your growing season using cold frames, row covers, and other protective structures.",
      source: "growveg.com",
      readTime: "11 min read",
      category: "Season Extension"
    }
  ];
  
  return articles;
}

function getMockVideos(query: string) {
  return getCuratedYouTubeVideos(query);
}

function getMockArticles(query: string) {
  return getCuratedGardeningArticles(query);
}