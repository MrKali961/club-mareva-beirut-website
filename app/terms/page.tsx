export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 max-w-3xl mx-auto">
      <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gold mb-8 tracking-wider">
        Terms of Service
      </h1>
      <div className="space-y-6 text-cream/80 font-playfair text-lg leading-relaxed">
        <p>
          By accessing Club Mareva Beirut&apos;s website and services, you agree to these terms of service in their entirety.
        </p>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            Intellectual Property Rights
          </h2>
          <p>
            All content on this website, including text, images, logos, graphics, branding, and design elements, is the exclusive property of Club Mareva Beirut and is protected by copyright law. You may not reproduce, distribute, or transmit any content without prior written permission from Club Mareva Beirut.
          </p>
        </div>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            Event Registrations
          </h2>
          <p>
            Event registrations are subject to availability. Club Mareva Beirut reserves the right to cancel, reschedule, or modify any event with reasonable notice. In the event of cancellation, registered guests will be notified and offered a full refund or alternative event.
          </p>
        </div>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            Use of Website
          </h2>
          <p>
            You agree to use this website only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of the website. Prohibited behavior includes:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Harassing or causing distress or inconvenience to any person</li>
            <li>Obscene or offensive language or content</li>
            <li>Disrupting the normal flow of dialogue within our website</li>
            <li>Attempting to gain unauthorized access to our systems</li>
          </ul>
        </div>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            Limitation of Liability
          </h2>
          <p>
            Club Mareva Beirut is provided on an &quot;as is&quot; basis. We do not warrant that the website will be uninterrupted or error-free. To the maximum extent permitted by law, Club Mareva Beirut shall not be liable for any damages arising from your use of or inability to use the website.
          </p>
        </div>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            Changes to Terms
          </h2>
          <p>
            Club Mareva Beirut reserves the right to modify these terms at any time. Your continued use of the website constitutes your acceptance of the updated terms. We recommend reviewing these terms periodically for changes.
          </p>
        </div>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-gold mb-3 tracking-wide">
            Questions or Concerns
          </h2>
          <p>
            For questions or concerns regarding these terms, please contact us at{' '}
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
