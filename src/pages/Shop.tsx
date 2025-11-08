import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

const Shop = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Books");

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  const books = [
    {
      id: 1,
      title: "The Purpose Driven Life",
      author: "Rick Warren",
      price: 5500,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop",
      featured: true,
    },
    {
      id: 2,
      title: "Mere Christianity",
      author: "C.S. Lewis",
      price: 4800,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=500&fit=crop",
    },
    {
      id: 3,
      title: "The Case for Christ",
      author: "Lee Strobel",
      price: 6200,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=500&fit=crop",
    },
    {
      id: 4,
      title: "Radical",
      author: "David Platt",
      price: 5000,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop",
    },
    {
      id: 5,
      title: "The Hiding Place",
      author: "Corrie ten Boom",
      price: 4500,
      image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=500&fit=crop",
    },
    {
      id: 6,
      title: "Boundaries",
      author: "Henry Cloud",
      price: 5800,
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=500&fit=crop",
    },
  ];

  const categories = [
    "All Books",
    "Christian Living",
    "Theology",
    "Devotionals",
    "Family & Relationships",
    "Biography",
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Books" || book.title.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">Shop</h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete collection of inspiring Christian literature
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 md:w-auto">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </Button>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2 animate-fade-in">
          {categories.map((category) => (
            <Button 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <div
              key={book.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <BookCard {...book} />
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
