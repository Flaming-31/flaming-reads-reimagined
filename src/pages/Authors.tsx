import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Authors = () => {
  const authors = [
    {
      id: 1,
      name: "Rick Warren",
      bio: "Pastor, author, and global spiritual leader. Best known for The Purpose Driven Life, which has transformed millions of lives worldwide.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bookCount: 8,
    },
    {
      id: 2,
      name: "C.S. Lewis",
      bio: "British writer and theologian. His works on Christian apologetics and fiction have become classics of Christian literature.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bookCount: 12,
    },
    {
      id: 3,
      name: "Lee Strobel",
      bio: "Former investigative journalist and award-winning author. Known for his evidence-based approach to Christian faith.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      bookCount: 6,
    },
    {
      id: 4,
      name: "Joyce Meyer",
      bio: "Bible teacher and bestselling author. Her practical teaching style has helped millions apply biblical principles to everyday life.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bookCount: 15,
    },
    {
      id: 5,
      name: "Max Lucado",
      bio: "Pastor and bestselling Christian author. Known for his accessible writing style and encouraging message of God's love.",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop",
      bookCount: 10,
    },
    {
      id: 6,
      name: "Priscilla Shirer",
      bio: "Bible teacher, author, and actress. Her dynamic teaching ministry has impacted women around the world.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
      bookCount: 7,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">
            Featured Authors
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Meet the inspiring voices behind the books that are transforming lives and deepening faith
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map((author, index) => (
            <Card
              key={author.id}
              className="overflow-hidden card-shadow hover:hover-shadow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-playfair font-semibold text-2xl mb-2">{author.name}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{author.bio}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {author.bookCount} books available
                  </span>
                  <Button size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    View Books
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Authors;
