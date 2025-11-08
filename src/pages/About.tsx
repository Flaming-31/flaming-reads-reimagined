import { Card, CardContent } from "@/components/ui/card";
import { Heart, BookOpen, Users, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">About Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Igniting faith and wisdom through transformative Christian literature
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="prose prose-lg mx-auto">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Welcome to <span className="font-playfair font-semibold text-primary">Flaming Books Nigeria</span>, 
              where faith meets literature. We are passionate about providing access to transformative Christian 
              books that inspire, educate, and strengthen the faith of believers across Nigeria and beyond.
            </p>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Founded with a vision to make quality Christian literature accessible to all, we carefully curate 
              our collection to ensure every book we offer has the potential to make a meaningful impact on your 
              spiritual journey. From classic theological works to contemporary Christian living guides, our 
              shelves are filled with wisdom that spans generations.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              More than just a bookstore, Flaming Books is a community of believers united by a love for God's 
              Word and a desire to grow deeper in faith. We host events, support local authors, and create 
              spaces where readers can connect, learn, and be inspired together.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Heart,
              title: "Faith-Centered",
              description: "Every book we offer is selected to strengthen and deepen your relationship with God",
            },
            {
              icon: BookOpen,
              title: "Quality Selection",
              description: "Carefully curated collection of impactful Christian literature from trusted authors",
            },
            {
              icon: Users,
              title: "Community Focus",
              description: "Building a community of readers who support and inspire one another in faith",
            },
            {
              icon: Target,
              title: "Mission Driven",
              description: "Committed to spreading the gospel through the transformative power of literature",
            },
          ].map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.title}
                className="text-center card-shadow hover:hover-shadow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-foreground" />
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
              <h2 className="font-playfair font-bold text-3xl mb-4 text-primary">Our Mission</h2>
              <p className="text-foreground leading-relaxed">
                To provide accessible, quality Christian literature that inspires faith, fosters spiritual 
                growth, and equips believers to live out their calling in Christ. We strive to be a trusted 
                resource for individuals, families, and churches seeking to deepen their understanding of 
                God's Word and apply its truths to everyday life.
              </p>
            </CardContent>
          </Card>
          <Card className="card-shadow animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-8">
              <h2 className="font-playfair font-bold text-3xl mb-4 text-primary">Our Vision</h2>
              <p className="text-foreground leading-relaxed">
                To become Nigeria's leading Christian bookstore, known for our exceptional selection, 
                passionate service, and vibrant community. We envision a Nigeria where every believer 
                has access to the resources they need to grow in faith and fulfill their God-given purpose.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="hero-gradient rounded-2xl p-8 md:p-12 text-center text-primary-foreground animate-fade-in">
          <h2 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
            Join Our Community
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-primary-foreground/90">
            Stay connected with us for new arrivals, exclusive offers, and inspiring content that nurtures your faith journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-primary-foreground text-foreground"
            />
            <button className="px-6 py-3 bg-primary-foreground text-primary rounded-md font-semibold hover:bg-primary-foreground/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
