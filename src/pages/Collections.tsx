import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Heart, Home, Sparkles, Cross, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Collections = () => {
  const collections = [
    {
      id: 1,
      title: "Christian Living",
      description: "Practical wisdom for everyday faith",
      icon: Cross,
      count: 45,
      color: "from-primary/20 to-primary/5",
    },
    {
      id: 2,
      title: "Devotionals",
      description: "Daily inspiration and reflection",
      icon: Heart,
      count: 32,
      color: "from-accent/20 to-accent/5",
    },
    {
      id: 3,
      title: "Family & Marriage",
      description: "Building strong, godly relationships",
      icon: Home,
      count: 28,
      color: "from-secondary/40 to-secondary/10",
    },
    {
      id: 4,
      title: "Theology",
      description: "Deep study of biblical truth",
      icon: BookOpen,
      count: 38,
      color: "from-primary/20 to-primary/5",
    },
    {
      id: 5,
      title: "Spiritual Growth",
      description: "Deepen your walk with God",
      icon: Sparkles,
      count: 52,
      color: "from-accent/20 to-accent/5",
    },
    {
      id: 6,
      title: "Leadership & Ministry",
      description: "Resources for Christian leaders",
      icon: Users,
      count: 24,
      color: "from-secondary/40 to-secondary/10",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">
            Book Collections
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collections, thoughtfully organized to help you find the perfect book for your spiritual journey
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => {
            const Icon = collection.icon;
            return (
              <Link
                key={collection.id}
                to="/shop"
                state={{ category: collection.title }}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="group overflow-hidden card-shadow hover:hover-shadow transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${collection.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-playfair font-semibold text-2xl mb-2 group-hover:text-primary transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{collection.description}</p>
                    <p className="text-sm text-primary font-semibold">
                      {collection.count} books
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Featured Collection Banner */}
        <div className="mt-16 hero-gradient rounded-2xl p-8 md:p-12 text-primary-foreground animate-fade-in">
          <div className="max-w-2xl">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
              New Arrivals Collection
            </h2>
            <p className="text-lg mb-6 text-primary-foreground/90">
              Discover the latest additions to our library. Fresh perspectives and timeless wisdom to enrich your faith journey.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-primary-foreground text-primary rounded-md font-semibold hover:bg-primary-foreground/90 transition-colors"
            >
              Browse New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
