import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isbn: string;
  publisher: string;
  pages: number;
  stock: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found");
      } else {
        setProduct(data);
      }

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false });

      if (reviewsData) {
        setReviews(reviewsData);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-playfair text-2xl mb-4">Product not found</h2>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-secondary py-20">
      <div className="container mx-auto px-4">
        <Link to="/shop">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="w-full aspect-[3/4] object-cover rounded-lg card-shadow"
            />
          </div>

          <div>
            <h1 className="font-playfair font-bold text-4xl mb-2">{product.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {product.author}</p>
            
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(avgRating) ? "fill-accent text-accent" : "text-muted"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground">
                ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-4xl font-bold text-primary mb-6">
              ₦{product.price.toLocaleString()}
            </p>

            <p className="text-lg mb-6 leading-relaxed">{product.description}</p>

            <div className="space-y-3 mb-8 text-muted-foreground">
              <p><strong>Category:</strong> {product.category}</p>
              {product.isbn && <p><strong>ISBN:</strong> {product.isbn}</p>}
              {product.publisher && <p><strong>Publisher:</strong> {product.publisher}</p>}
              {product.pages && <p><strong>Pages:</strong> {product.pages}</p>}
              <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => addToCart(product.id)}
              disabled={cartLoading || product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-playfair font-bold text-2xl mb-6">Customer Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-accent text-accent" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;
