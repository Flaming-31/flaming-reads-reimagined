import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Okonkwo",
      message: "Flaming Books has been a blessing to my spiritual journey. The books I've purchased have deepened my faith and transformed my perspective on life.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Michael Adeyemi",
      message: "Fast delivery and excellent customer service. The collection of Christian literature is outstanding. Highly recommend!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Grace Chukwu",
      message: "As a youth leader, I've found incredible resources here. The books have been instrumental in our bible study groups.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Pastor David Eze",
      message: "Flaming Books is my go-to source for quality Christian literature. They have an impressive selection for both personal study and ministry use.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">Testimonials</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Read what our customers are saying about their experience with Flaming Books
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="card-shadow hover:hover-shadow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.message}"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Testimonial Form */}
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Card className="card-shadow">
            <CardContent className="p-8">
              <h2 className="font-playfair font-bold text-3xl mb-6 text-center">
                Share Your Experience
              </h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className="h-8 w-8 text-accent hover:fill-accent" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Testimonial
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Share your experience with Flaming Books..."
                    rows={5}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Submit Testimonial
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Your testimonial will be reviewed before being published on our website
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
