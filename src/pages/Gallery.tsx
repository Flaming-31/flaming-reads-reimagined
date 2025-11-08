import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Play, Headphones } from "lucide-react";

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("photos");

  const photos = [
    {
      id: 1,
      title: "Book Launch Event",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Reading Community",
      image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Author Signing",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop",
    },
    {
      id: 4,
      title: "Book Fair 2023",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    },
    {
      id: 5,
      title: "Youth Workshop",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
    },
    {
      id: 6,
      title: "Community Gathering",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
    },
  ];

  const videos = [
    {
      id: 1,
      title: "Book Launch Highlights 2024",
      thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Author Interview: Faith Journey",
      thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Reading Challenge Recap",
      thumbnail: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&h=400&fit=crop",
    },
  ];

  const podcasts = [
    {
      id: 1,
      title: "Faith & Literature: Episode 12",
      description: "Exploring the impact of Christian literature in modern times",
      duration: "45:30",
    },
    {
      id: 2,
      title: "Author Spotlight: Writing with Purpose",
      description: "Interview with bestselling Christian authors",
      duration: "38:15",
    },
    {
      id: 3,
      title: "Book Club Discussion: The Journey",
      description: "Deep dive into transformative Christian classics",
      duration: "52:20",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">Gallery</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our collection of photos, videos, and podcasts from events and community moments
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          </TabsList>

          {/* Photos Tab */}
          <TabsContent value="photos" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, index) => (
                <Card
                  key={photo.id}
                  className="overflow-hidden card-shadow hover:hover-shadow transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{photo.title}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <Card
                  key={video.id}
                  className="overflow-hidden card-shadow hover:hover-shadow transition-all duration-300 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{video.title}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Podcasts Tab */}
          <TabsContent value="podcasts" className="animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-4">
              {podcasts.map((podcast, index) => (
                <Card
                  key={podcast.id}
                  className="card-shadow hover:hover-shadow transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-playfair font-semibold text-xl mb-1">
                        {podcast.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {podcast.description}
                      </p>
                      <span className="text-xs text-primary font-semibold">
                        {podcast.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0">
                      <Play className="h-6 w-6 ml-0.5" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Gallery;
