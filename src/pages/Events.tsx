import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { getPastEvents, getUpcomingEvents } from "@/lib/events";
import { toast } from "sonner";

const Events = () => {
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

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
            {upcomingEvents.length === 0 && (
              <p className="text-muted-foreground">No upcoming events yet. Please check back soon!</p>
            )}
            {upcomingEvents.map((event, index) => (
              <Card
                key={event.slug}
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
                      <span className="text-sm">{event.displayDate}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">{event.description}</p>
                  {event.ctaUrl ? (
                    <Button className="w-full" asChild>
                      <a href={event.ctaUrl} target="_blank" rel="noreferrer">
                        RSVP Now
                      </a>
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => toast.info("RSVP link coming soon. Please check back later.")}
                    >
                      RSVP Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h2 className="font-playfair font-bold text-3xl mb-8 animate-fade-in">Past Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pastEvents.length === 0 && (
              <p className="text-muted-foreground">No past events yet.</p>
            )}
            {pastEvents.map((event, index) => (
              <Card
                key={event.slug}
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
                      <span className="text-sm">{event.displayDate}</span>
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
