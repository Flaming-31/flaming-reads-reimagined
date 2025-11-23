import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { getAllAuthors } from "@/lib/authors";
import { Link } from "react-router-dom";

const Authors = () => {
  const authors = getAllAuthors();

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
              key={author.slug}
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
                  <Button size="sm" className="gap-2" asChild>
                    <Link to="/shop" state={{ author: author.name }}>
                      <BookOpen className="h-4 w-4" />
                      View Books
                    </Link>
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
