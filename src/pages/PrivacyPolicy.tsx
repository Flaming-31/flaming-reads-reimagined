const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="animate-fade-in">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">Introduction</h2>
              <p className="text-foreground/80 mb-4">
                Welcome to Flaming Books Nigeria. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we handle your personal data when you visit our website and tell 
                you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">Information We Collect</h2>
              <p className="text-foreground/80 mb-4">We may collect, use, store and transfer different kinds of personal data about you:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li>Identity Data: name, username or similar identifier</li>
                <li>Contact Data: email address, telephone numbers, delivery address</li>
                <li>Transaction Data: details about payments and purchases from you</li>
                <li>Technical Data: IP address, browser type, device information</li>
                <li>Usage Data: information about how you use our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">How We Use Your Information</h2>
              <p className="text-foreground/80 mb-4">We use your personal data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li>To process and fulfill your orders</li>
                <li>To manage payments, fees and charges</li>
                <li>To communicate with you about your orders and our services</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To improve our website and services</li>
                <li>To protect against fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">Payment Processing</h2>
              <p className="text-foreground/80 mb-4">
                We use Paystack as our payment processor. When you make a purchase, your payment information is processed 
                securely through Paystack's platform. We do not store your complete payment card details on our servers. 
                Please refer to Paystack's privacy policy for information on how they handle your payment data.
              </p>
            </section>

            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">Data Security</h2>
              <p className="text-foreground/80 mb-4">
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
                used, accessed, altered or disclosed in an unauthorized way. We limit access to your personal data to those 
                employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">Your Rights</h2>
              <p className="text-foreground/80 mb-4">Under data protection laws, you have rights including:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li>The right to access your personal data</li>
                <li>The right to request correction of your personal data</li>
                <li>The right to request erasure of your personal data</li>
                <li>The right to object to processing of your personal data</li>
                <li>The right to request restriction of processing your personal data</li>
                <li>The right to withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">Cookies</h2>
              <p className="text-foreground/80 mb-4">
                Our website uses cookies to distinguish you from other users. This helps us provide you with a good experience 
                when you browse our website and allows us to improve our site. You can set your browser to refuse all or some 
                browser cookies, or to alert you when websites set or access cookies.
              </p>
            </section>

            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">Third-Party Links</h2>
              <p className="text-foreground/80 mb-4">
                Our website may include links to third-party websites, plug-ins and applications. Clicking on those links or 
                enabling those connections may allow third parties to collect or share data about you. We do not control these 
                third-party websites and are not responsible for their privacy statements.
              </p>
            </section>

            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">Contact Us</h2>
              <p className="text-foreground/80 mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us through our 
                Contact page or email us directly. We will respond to your inquiry as soon as possible.
              </p>
            </section>

            <section>
              <h2 className="font-playfair font-semibold text-2xl mb-4 text-foreground">Changes to This Policy</h2>
              <p className="text-foreground/80 mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
                privacy policy on this page and updating the "Last updated" date at the top of this policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
