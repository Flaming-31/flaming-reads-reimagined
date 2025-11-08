import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-playfair font-bold text-xl">FB</span>
              </div>
              <div>
                <h3 className="font-playfair font-bold text-lg">Flaming Books</h3>
                <p className="text-xs text-muted-foreground">Nigeria</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Inspiring faith and wisdom through transformative Christian literature.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shop</Link></li>
              <li><Link to="/collections" className="text-sm text-muted-foreground hover:text-primary transition-colors">Collections</Link></li>
              <li><Link to="/authors" className="text-sm text-muted-foreground hover:text-primary transition-colors">Authors</Link></li>
              <li><Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">Testimonials</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Lagos, Nigeria</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">info@flamingbooks.com.ng</span>
              </li>
            </ul>
            <div className="flex space-x-3 mt-4">
              <a
                href="https://www.instagram.com/flaming_books01/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://web.facebook.com/profile.php?id=61568988145162"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Flaming Books Nigeria. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
