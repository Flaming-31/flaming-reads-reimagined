import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sun, RefreshCw, Target, Award, Star, Feather } from "lucide-react";
import { toast } from "sonner";
import { submitSubscription, SubscriptionError } from "@/lib/subscription";
import { getAboutContent } from "@/lib/about-content";

const ICON_MAP = {
  Heart,
  Sun,
  RefreshCw,
  Target,
  Award,
  Star,
  Feather,
};

const About = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const content = useMemo(() => getAboutContent(), []);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setSubmitting(true);
    try {
      await submitSubscription(email);
      toast.success("Thanks for joining our community!");
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
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">{content.title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        {/* Story Section */}
        <div className="max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="prose prose-lg mx-auto">
            {content.story.map((paragraph, index) => (
              <p
                key={index}
                className={`text-lg text-foreground leading-relaxed ${index < content.story.length - 1 ? "mb-6" : ""}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {content.values.map((value, index) => {
            const IconComponent = ICON_MAP[value.icon as keyof typeof ICON_MAP] ?? Heart;
            return (
              <Card
                key={`${value.title}-${index}`}
                className="text-center card-shadow hover:hover-shadow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-playfair font-semibold text-xl mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="card-shadow animate-fade-in">
            <CardContent className="p-8">
              <h2 className="font-playfair font-bold text-3xl mb-4 text-primary">{content.mission.title}</h2>
              <p className="text-foreground leading-relaxed">{content.mission.body}</p>
            </CardContent>
          </Card>
          <Card className="card-shadow animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-8">
              <h2 className="font-playfair font-bold text-3xl mb-4 text-primary">{content.vision.title}</h2>
              <p className="text-foreground leading-relaxed">{content.vision.body}</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="hero-gradient rounded-2xl p-8 md:p-12 text-center text-primary-foreground animate-fade-in">
          <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-4">{content.cta.title}</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-primary-foreground/90">{content.cta.description}</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder={content.cta.placeholder}
              className="flex-1 px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-primary-foreground text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary-foreground text-primary rounded-md font-semibold hover:bg-primary-foreground/90 transition-colors"
              disabled={submitting}
            >
              {submitting ? "Subscribing..." : content.cta.button}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;
