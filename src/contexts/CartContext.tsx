import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { toast } from "sonner";
import { getBookBySlug } from "@/lib/books";

interface CartProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  author: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "fb_cart";

const loadStoredCart = (): CartItem[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse cart from storage", error);
    return [];
  }
};

const persistCart = (cart: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => loadStoredCart());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    persistCart(cart);
  }, [cart]);

  const addToCart = (productId: string) => {
    const book = getBookBySlug(productId);
    if (!book) {
      toast.error("Book not found");
      return;
    }

    setLoading(true);
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const newItem: CartItem = {
        id: crypto.randomUUID(),
        quantity: 1,
        product: {
          id: book.id,
          title: book.title,
          price: book.price,
          image: book.image,
          author: book.author,
        },
      };
      return [...prev, newItem];
    });
    toast.success("Added to cart");
    setLoading(false);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    toast.success("Removed from cart");
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
