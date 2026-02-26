export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 max-w-3xl mx-auto">
      <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gold mb-8 tracking-wider">
        Privacy Policy
      </h1>
      <div className="space-y-6 text-cream/80 font-playfair text-lg leading-relaxed">
        <p>
          Club Mareva Beirut respects your privacy and is committed to protecting your personal data.
        </p>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            Information We Collect
          </h2>
          <p>
            We collect only the information necessary to provide our services, including event registrations and contact form submissions. This may include your name, email address, phone number, and any message content you provide.
          </p>
        </div>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            How We Use Your Information
          </h2>
          <p>
            Your information is used exclusively to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Process event registrations and send confirmation details</li>
            <li>Respond to your inquiries and contact form submissions</li>
            <li>Improve our website and services</li>
          </ul>
        </div>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            Data Protection
          </h2>
          <p>
            Your data is never sold, shared, or transferred to third parties without your explicit consent. We implement industry-standard security measures to protect your personal information.
          </p>
        </div>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            Contact Us
          </h2>
          <p>
            For any privacy-related inquiries, please contact us at{' '}
            <a
              href="mailto:info@clubmareva.com"
              className="text-gold hover:text-gold-light transition-colors underline"
            >
              info@clubmareva.com
            </a>
            .
          </p>
        </div>

        <div className="pt-12 border-t border-gold/20">
          <p className="text-sm text-cream/60">
            Last updated: February 2026
          </p>
        </div>
      </div>
    </main>
  );
}
