import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitTestimonial, TestimonialError } from "@/lib/testimonial";
import { getApprovedTestimonials } from "@/lib/testimonials-content";

const Testimonials = () => {
  const testimonials = useMemo(() => getApprovedTestimonials(), []);

  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await submitTestimonial(formData);
      toast.success("Thanks for sharing your experience! We'll review it shortly.");
      setFormData({ name: "", rating: 5, message: "" });
    } catch (error) {
      const message =
        error instanceof TestimonialError
          ? error.message
          : "Failed to submit testimonial. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

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
              key={testimonial.slug}
              className="card-shadow hover:hover-shadow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
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
                        className={`p-1 transition-transform ${
                          formData.rating === star ? "scale-110" : "hover:scale-110"
                        }`}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        aria-pressed={formData.rating === star}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            formData.rating >= star ? "fill-accent text-accent" : "text-muted-foreground"
                          }`}
                        />
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
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Testimonial"}
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
