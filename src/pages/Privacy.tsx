import Navbar from "@/components/layout/Navbar";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <title>Privacy Policy | Saved by the Plate Inc.</title>
      <meta name="description" content="Read the privacy policy for Saved by the Plate Inc. Learn how we collect, use, and protect your information." />
      <link rel="canonical" href="https://www.savedbytheplate.org/privacy" />
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <p>
            Saved by the plate Inc. is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (https://www.savedbytheplate.com).
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Names:</strong> We collect names to personalize our communications with you.</li>
              <li><strong>Email Addresses:</strong> We collect email addresses to communicate with you about our programs and services.</li>
              <li><strong>Physical Addresses:</strong> We collect physical addresses for our local food map so you can find local food around you.</li>
              <li><strong>Phone Numbers:</strong> We collect phone numbers of the spaces on our local food map so users can contact them for any reason.</li>
              <li><strong>Donation Information:</strong> We collect donation information to process your contributions and provide tax receipts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Use Your Information</h2>
            <p>We use the information we collect for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and improving our services</li>
              <li>Communicating with you about our programs and services</li>
              <li>Understanding how visitors use our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Third-Party Service Providers</h2>
            <p>
              We work with third-party providers, such as Stripe for payment processing, Donately for donations, Lovable for website tracking analytics, Beehiiv for email newsletters. These providers process data on our behalf in compliance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Cookies and Tracking Technologies</h2>
            <p>We use the following types of cookies and tracking technologies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential/Functional Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</li>
              <li><strong>Analytics Cookies:</strong> We use these cookies to collect information about how visitors use our website. This helps us improve our site and your experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Share Your Information</h2>
            <p>As a nonprofit organization committed to transparency, we may share information under these specific circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> With trusted partners who help us operate our website, process donations, or deliver our programs.</li>
              <li><strong>Legal Requirements:</strong> When required by law, such as in response to a valid legal request or to protect our rights.</li>
              <li><strong>With Your Permission:</strong> When you've explicitly asked us to share your information.</li>
            </ul>
            <p className="mt-4">
              <strong>Limited Sharing:</strong> Beyond the circumstances described above, we do not share your personal information with other organizations. We value the trust you place in us and are committed to protecting your privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data Retention</h2>
            <p>
              We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, including any legal, accounting, or reporting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data Protection</h2>
            <p>
              We implement reasonable precautions to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data.
            </p>
            <p className="mt-4">
              To exercise your privacy rights, please email <a href="mailto:info@savedbytheplate.com" className="text-sbtp-orange-500 hover:text-sbtp-orange-600 underline">info@savedbytheplate.com</a> with 'Privacy Request' in the subject line. We will verify your identity and respond within 30 days as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Children's Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">External Websites</h2>
            <p>
              Our website may include links to third-party websites for your convenience and reference. Saved by the plate Inc. is not responsible for the content, security, or privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@savedbytheplate.com" className="text-sbtp-orange-500 hover:text-sbtp-orange-600 underline">info@savedbytheplate.com</a>.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            <strong>Effective Date:</strong> October 9, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
