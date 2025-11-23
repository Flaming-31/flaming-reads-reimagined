import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { getAllBooks } from "@/lib/books";

const Shop = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [products, setProducts] = useState(() => getAllBooks());

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
    if (location.state?.author) {
      setSelectedAuthor(location.state.author);
    }
  }, [location.state]);

  const categories = [
    "All Books",
    "Theology",
    "Devotional",
    "Christian Living",
    "Bible Study",
    "Biography",
    "Children",
    "Youth",
    "Fiction",
    "Reference"
  ];

  const filteredBooks = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Books" || product.category === selectedCategory;
      const matchesAuthor = selectedAuthor ? product.author === selectedAuthor : true;
      return matchesSearch && matchesCategory && matchesAuthor;
    });
  }, [products, searchQuery, selectedCategory, selectedAuthor]);

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
        <>
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
        </>
      </div>
    </div>
  );
};

export default Shop;
