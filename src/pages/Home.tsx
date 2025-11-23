import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import BookCard from "@/components/BookCard";
import { getFeaturedBooks } from "@/lib/books";
import { submitSubscription, SubscriptionError } from "@/lib/subscription";
import { toast } from "sonner";

const Home = () => {
  const featuredBooks = getFeaturedBooks(4);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setSubmitting(true);
    try {
      await submitSubscription(email);
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      const message =
        error instanceof SubscriptionError
          ? error.message
          : "Unable to subscribe right now. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient text-primary-foreground py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="font-playfair font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Igniting Faith Through Transformative Literature
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Discover inspiring Christian books that deepen your walk with God and transform your life.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" variant="secondary" className="gap-2">
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/collections">
                <Button size="lg" variant="secondary">
                  Browse Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10">
          <BookOpen className="w-full h-full" />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-playfair font-semibold text-xl mb-2">Curated Collections</h3>
              <p className="text-muted-foreground">
                Handpicked books for every stage of your spiritual journey
              </p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-playfair font-semibold text-xl mb-2">Trusted Authors</h3>
              <p className="text-muted-foreground">
                Works from renowned Christian authors and speakers
              </p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-playfair font-semibold text-xl mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and reliable delivery across Nigeria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-4">Featured Books</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our carefully selected collection of life-changing Christian literature
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredBooks.map((book, index) => (
              <div
                key={book.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookCard {...book} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/shop">
              <Button size="lg" className="gap-2">
                View All Books
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
              Stay Inspired
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Subscribe to our newsletter for book recommendations, exclusive offers, and spiritual insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button size="lg" type="submit" disabled={submitting}>
                {submitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
