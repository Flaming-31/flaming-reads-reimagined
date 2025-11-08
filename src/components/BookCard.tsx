import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BookCardProps {
  title: string;
  author: string;
  price: number;
  image: string;
  featured?: boolean;
}

const BookCard = ({ title, author, price, image, featured }: BookCardProps) => {
  return (
    <Card className="group overflow-hidden card-shadow hover:hover-shadow transition-all duration-300">
      <div className="relative overflow-hidden aspect-[3/4] bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {featured && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-playfair font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{author}</p>
        <p className="font-semibold text-xl text-primary">₦{price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          View Details
        </Button>
        <Button size="sm" className="flex-1 gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
