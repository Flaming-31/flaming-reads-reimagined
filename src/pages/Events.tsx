import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Book Launch: Walking in Faith",
      date: "March 15, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Lagos, Nigeria",
      description: "Join us for the official launch of this inspiring new book on practical faith. Meet the author, enjoy refreshments, and get your signed copy.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Christian Literature Workshop",
      date: "April 2, 2024",
      time: "10:00 AM - 3:00 PM",
      location: "Abuja, Nigeria",
      description: "A comprehensive workshop for aspiring Christian writers. Learn craft, find your voice, and connect with publishers.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=400&fit=crop",
      status: "upcoming",
    },
  ];

  const pastEvents = [
    {
      id: 3,
      title: "Annual Book Fair 2023",
      date: "December 10, 2023",
      location: "Lagos, Nigeria",
      description: "Our biggest event of the year featured over 500 titles, author meet-and-greets, and special discounts.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
      status: "past",
    },
    {
      id: 4,
      title: "Youth Reading Challenge",
      date: "October 15, 2023",
      location: "Port Harcourt, Nigeria",
      description: "A successful reading initiative that engaged over 200 young readers in transformative Christian literature.",
      image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&h=400&fit=crop",
      status: "past",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">Events</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join us for book launches, workshops, and community gatherings celebrating faith and literature
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h2 className="font-playfair font-bold text-3xl mb-8 animate-fade-in">Upcoming Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card
                key={event.id}
                className="overflow-hidden card-shadow hover:hover-shadow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-[2/1] overflow-hidden bg-muted">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-playfair font-semibold text-2xl mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">{event.description}</p>
                  <Button className="w-full">RSVP Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h2 className="font-playfair font-bold text-3xl mb-8 animate-fade-in">Past Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pastEvents.map((event, index) => (
              <Card
                key={event.id}
                className="overflow-hidden card-shadow hover:hover-shadow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-[2/1] overflow-hidden bg-muted">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-playfair font-semibold text-2xl mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
