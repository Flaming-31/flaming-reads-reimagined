import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PaystackButton } from "react-paystack";
import { useAuth } from "@/contexts/AuthContext";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createOrder = async (reference: string) => {
    setLoading(true);

    if (!user) {
      toast.error("Please sign in to complete your order");
      setLoading(false);
      return;
    }

    // Simulate order creation locally
    await new Promise((resolve) => setTimeout(resolve, 600));

    await clearCart();
    toast.success(`Order placed successfully! Ref: ${reference}`);
    navigate("/");
    setLoading(false);
  };

  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: total * 100, // Paystack expects amount in kobo
    publicKey: paystackPublicKey ?? "",
  };

  const handlePaystackSuccess = (reference: any) => {
    createOrder(reference.reference);
  };

  const handlePaystackClose = () => {
    toast.error("Payment cancelled");
  };

  const componentProps = {
    ...paystackConfig,
    text: "Pay with Paystack",
    onSuccess: handlePaystackSuccess,
    onClose: handlePaystackClose,
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary py-20">
      <div className="container mx-auto px-4">
        <h1 className="font-playfair font-bold text-4xl mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Shipping Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.title} × {item.quantity}
                    </span>
                    <span>₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₦{total.toLocaleString()}</span>
                  </div>
                </div>
                <PaystackButton
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium"
                  {...componentProps}
                />
                <p className="text-xs text-muted-foreground text-center">
                  * Replace the Paystack public key with your actual key in src/pages/Checkout.tsx
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
