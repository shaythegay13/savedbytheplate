import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";

// Terms of Service page with working in-page anchor links

const sections: { id: string; title: string }[] = [
  { id: "services", title: "1. Our Services" },
  { id: "ip", title: "2. Intellectual Property Rights" },
  { id: "user-representations", title: "3. User Representations" },
  { id: "user-registration", title: "4. User Registration" },
  { id: "subscriptions", title: "5. Subscriptions" },
  { id: "prohibited-activities", title: "6. Prohibited Activities" },
  { id: "ugc", title: "7. User Generated Contributions" },
  { id: "contribution-license", title: "8. Contribution License" },
  { id: "reviews", title: "9. Guidelines for Reviews" },
  { id: "third-party", title: "10. Third-Party Websites and Content" },
  { id: "services-management", title: "11. Services Management" },
  { id: "privacy", title: "12. Privacy Policy" },
  { id: "copyright", title: "13. Copyright Infringements" },
  { id: "term", title: "14. Term and Termination" },
  { id: "modifications", title: "15. Modifications and Interruptions" },
  { id: "governing-law", title: "16. Governing Law" },
  { id: "dispute-resolution", title: "17. Dispute Resolution" },
  { id: "corrections", title: "18. Corrections" },
  { id: "disclaimer", title: "19. Disclaimer" },
  { id: "liability", title: "20. Limitations of Liability" },
  { id: "indemnification", title: "21. Indemnification" },
  { id: "user-data", title: "22. User Data" },
  { id: "electronic", title: "23. Electronic Communications, Transactions, and Signatures" },
  { id: "california", title: "24. California Users and Residents" },
  { id: "misc", title: "25. Miscellaneous" },
  { id: "contact", title: "26. Contact Us" },
];

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }
};

const Terms: React.FC = () => {
  useEffect(() => {
    document.title = "Terms of Service | Saved by the Plate";

    const metaDesc = document.querySelector('meta[name="description"]');
    const content = "Read our Terms of Service for Saved by the Plate, including user rights, limitations of liability, and policies.";
    if (metaDesc) {
      metaDesc.setAttribute("content", content);
    } else {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      m.setAttribute("content", content);
      document.head.appendChild(m);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    const url = `${window.location.origin}/terms`;
    if (canonical) {
      canonical.setAttribute("href", url);
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", url);
      document.head.appendChild(link);
    }

    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => scrollToId(id), 50);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-sbtp-green-800">Terms of Service</h1>
          <p className="text-sm text-sbtp-brown-600 mt-2">Last updated: October 09, 2025</p>
        </header>

        <nav aria-label="Table of contents" className="mb-10">
          <h2 className="sr-only">Table of Contents</h2>
          <ul className="grid md:grid-cols-2 gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(s.id);
                  }}
                  className="inline-block w-full rounded-md border border-sbtp-green-200/50 bg-white/60 px-4 py-2 text-sbtp-green-800 hover:bg-sbtp-green-50 transition"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main>
          {/* Agreement intro */}
          <section className="scroll-mt-24 mb-10" aria-labelledby="agreement-intro">
            <h2 id="agreement-intro" className="text-2xl font-semibold text-sbtp-green-800 mb-3">
              Agreement to Our Legal Terms
            </h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                We are Saved by the Plate Inc. ("Company," "we," "us," "our"), a company registered in New York, United States at 556 W 141st Street, Apartment 4E, New York, NY 10031. We operate the website{" "}
                <a href="https://www.savedbytheplate.com" className="text-sbtp-green-700 underline" rel="noopener noreferrer">https://www.savedbytheplate.com</a>{" "}
                (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
              </p>
              <p>
                You can contact us by phone at <a href="tel:2072401913" className="text-sbtp-green-700 underline">2072401913</a>, email at{" "}
                <a href="mailto:info@savedbytheplate.com" className="text-sbtp-green-700 underline">info@savedbytheplate.com</a>, or by mail to 556 W 141st Street, Apartment 4E, New York, NY 10031, United States.
              </p>
              <p>
                These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Saved by the Plate Inc., concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
              </p>
              <p>
                We will provide you with prior notice of any scheduled changes to the Services you are using. The modified Legal Terms will become effective upon posting or notifying you by info@savedbytheplate.com, as stated in the email message. By continuing to use the Services after the effective date of any changes, you agree to be bound by the modified terms.
              </p>
              <p>
                The Services are intended for users who are at least 13 years of age. All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services. If you are a minor, you must have your parent or guardian read and agree to these Legal Terms prior to you using the Services.
              </p>
              <p>We recommend that you print a copy of these Legal Terms for your records.</p>
            </article>
          </section>

          {/* Sections 1–26 */}
          <section id="services" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">1. Our Services</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
              </p>
              <h3>Student Data Privacy and Security</h3>
              <p>
                We are committed to protecting student information and privacy. Our platform collects student data only as necessary for educational purposes, and we do not sell, share, or use student data for advertising or any commercial purpose. All student records and personally identifiable information are stored securely and accessed only by authorized personnel in compliance with applicable privacy laws.
              </p>
              <h3>FERPA and Applicable Law Compliance</h3>
              <p>
                We comply with the Family Educational Rights and Privacy Act (FERPA) and any other relevant student privacy regulations when partnering with schools or educational institutions. All educational records entrusted to the platform are handled in accordance with applicable federal and state law, and shall not be disclosed except as permitted by law or with proper consent.
              </p>
              <h3>Data Deletion and Retention Policy</h3>
              <p>
                Users or their guardians may request the deletion of personal information at any time by contacting our support team. Upon account closure or written request, we will permanently delete all student data, except where retention is required by law for educational records or dispute resolution. Data not required by law will be deleted within 30 days of request.
              </p>
              <h3>Prohibition on Targeted Advertising and Profiling</h3>
              <p>
                We do not engage in targeted advertising, profiling, or commercial use of student data. Personally identifiable student information will never be used to build user profiles for marketing purposes or shared with third-party advertisers.
              </p>
              <h3>Age Limitation and Parental Consent</h3>
              <p>
                Our platform is designed for users age 13 and above. Use of our services by minors under the age of 18 requires parental or legal guardian consent, which must be provided during registration. We reserve the right to request proof of age or consent and may terminate accounts found to be in violation of this policy.
              </p>
              <h3>User Responsibilities and Acceptable Conduct</h3>
              <p>
                Users must comply with community guidelines and engage respectfully with educational content and peers. Misuse of the platform, including inappropriate conduct, unauthorized data access, or content violations, will result in account suspension or termination.
              </p>
              <h3>Data Breach Notification</h3>
              <p>
                In the event of a data breach involving student or user information, we will promptly notify affected users, schools, and, where applicable, parents or guardians. We will take immediate action to contain the breach and comply with all legal reporting requirements.
              </p>
              <h3>Limitation of Liability and Warranty Disclaimer</h3>
              <p>
                Our platform and educational content are provided ‘as is’ and ‘as available.’ We do not guarantee uninterrupted access or the accuracy of educational content. To the fullest extent permitted by law, we disclaim liability for any damages arising from data breaches, service interruption, or third-party content.
              </p>
              <h3>Modifications and Notification of Changes</h3>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. Notice of material changes will be posted on our website or sent via email to registered users. Continued use of the platform after modifications constitutes acceptance of the updated terms.
              </p>
            </article>
          </section>

          <section id="ip" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">2. Intellectual Property Rights</h2>
            <article className="prose prose-neutral max-w-none">
              <h3>Our intellectual property</h3>
              <p>
                We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks"). Our Content and Marks are protected by copyright and trademark laws and treaties in the United States and around the world. The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use or internal business purpose only.
              </p>
              <h3>Your use of our Services</h3>
              <p>
                Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to access the Services; and download or print a copy of any portion of the Content to which you have properly gained access, solely for your personal, non-commercial use or internal business purpose.
              </p>
              <p>
                Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
              </p>
              <p>
                If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to:{" "}
                <a href="mailto:info@savedbytheplate.com" className="text-sbtp-green-700 underline">info@savedbytheplate.com</a>. If we ever grant you permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors and ensure that any copyright or proprietary notice appears on posting, reproducing, or displaying our Content. We reserve all rights not expressly granted to you in and to the Services, Content, and Marks. Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.
              </p>
              <h3>Your submissions and contributions</h3>
              <p>
                Submissions: By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, without acknowledgment or compensation to you.
              </p>
              <p>
                Contributions: The Services may invite you to chat, contribute to, or participate in forums and other functionality during which you may create or post content and materials ("Contributions"). Any publicly posted Submission shall also be treated as a Contribution. You understand that Contributions may be viewable by other users of the Services and possibly through third-party websites.
              </p>
              <p>
                When you post Contributions, you grant us a worldwide, perpetual, non-exclusive, transferable, royalty-free, fully-paid license to use, copy, reproduce, distribute, sell, resell, publish, broadcast, store, publicly perform and display, reformat, translate, excerpt, and exploit your Contributions for any purpose, and to prepare derivative works of, or incorporate into other works, your Contributions, and to sublicense the foregoing, including use of your name, trademarks, and logos.
              </p>
              <p>
                You are responsible for what you post or upload and warrant that your Submissions/Contributions comply with our "PROHIBITED ACTIVITIES" and are original or licensed, and do not constitute confidential information. We may remove or edit Content at any time, suspend or disable accounts, and report unlawful content to authorities.
              </p>
              <h3>Copyright infringement</h3>
              <p>
                We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please refer to section 13 (Copyright Infringements).
              </p>
            </article>
          </section>

          <section id="user-representations" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">3. User Representations</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update it as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not under the age of 13; (5) you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Services; (6) you will not access the Services through automated or non-human means; (7) you will not use the Services for any illegal or unauthorized purpose; and (8) your use of the Services will not violate any applicable law or regulation. If you provide any information that is untrue, inaccurate, not current, or incomplete, we may suspend or terminate your account and refuse any and all current or future use of the Services.
              </p>
            </article>
          </section>

          <section id="user-registration" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">4. User Registration</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
              </p>
            </article>
          </section>

          <section id="subscriptions" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">5. Subscriptions</h2>
            <article className="prose prose-neutral max-w-none">
              <h3>Billing and Renewal</h3>
              <p>
                Your subscription will continue and automatically renew unless canceled. You consent to recurring charges to your payment method until you cancel. Billing cycle: monthly.
              </p>
              <h3>Cancellation</h3>
              <p>
                You can cancel your subscription at any time by logging into your account. Your cancellation takes effect at the end of the current paid term. For questions, contact{" "}
                <a href="mailto:info@savedbytheplate.com" className="text-sbtp-green-700 underline">info@savedbytheplate.com</a>.
              </p>
              <h3>Fee Changes</h3>
              <p>
                We may change subscription fees from time to time and will communicate any price changes to you in accordance with applicable law.
              </p>
            </article>
          </section>

          <section id="prohibited-activities" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">6. Prohibited Activities</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
              </p>
              <ul>
                <li>Systematically retrieve data or other content from the Services to create a compilation, database, or directory without our written permission.</li>
                <li>Trick, defraud, or mislead us and other users.</li>
                <li>Circumvent or interfere with security-related features of the Services.</li>
                <li>Disparage, tarnish, or otherwise harm us and/or the Services.</li>
                <li>Use information from the Services to harass, abuse, or harm another person.</li>
                <li>Make improper use of support services or submit false reports.</li>
                <li>Use the Services in violation of applicable laws or regulations.</li>
                <li>Unauthorized framing or linking to the Services.</li>
                <li>Upload or transmit viruses or other disruptive material.</li>
                <li>Automated use of the system without authorization.</li>
                <li>Delete copyright or proprietary rights notices from any Content.</li>
                <li>Impersonate another user or person.</li>
                <li>Upload or transmit passive or active information collection mechanisms without consent.</li>
                <li>Interfere with or create an undue burden on the Services or networks.</li>
                <li>Harass, annoy, intimidate, or threaten our employees or agents.</li>
                <li>Attempt to bypass measures designed to prevent or restrict access.</li>
                <li>Copy or adapt the Services' software.</li>
                <li>Reverse engineer software except as permitted by law.</li>
                <li>Use or launch any unauthorized automated system.</li>
                <li>Use a buying or purchasing agent to make purchases on the Services.</li>
                <li>Make any unauthorized use of the Services, including collecting user emails for unsolicited email.</li>
                <li>Use the Services to compete with us or for revenue-generating endeavors not authorized by us.</li>
                <li>Use the Services to advertise or sell goods and services.</li>
                <li>Sell or transfer your profile.</li>
              </ul>
            </article>
          </section>

          <section id="ugc" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">7. User Generated Contributions</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials ("Contributions"). Contributions may be viewable by other users and through third-party websites and may be treated as non-confidential and non-proprietary.
              </p>
              <p>
                You represent and warrant that your Contributions do not infringe third-party rights; you have necessary permissions; your Contributions are not false, unlawful, or objectionable; do not violate privacy or publicity rights; comply with child protection laws; and do not violate these Legal Terms or any applicable law.
              </p>
            </article>
          </section>

          <section id="contribution-license" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">8. Contribution License</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                By posting Contributions, you grant us a worldwide, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid license to host, use, copy, reproduce, disclose, sell, publish, broadcast, archive, store, cache, publicly perform and display, reformat, translate, transmit, excerpt, and distribute such Contributions for any purpose, and to prepare derivative works or incorporate into other works, and to grant sublicenses. You waive all moral rights in your Contributions and warrant that moral rights have not otherwise been asserted.
              </p>
              <p>
                We do not claim ownership over your Contributions. You retain full ownership of all Contributions and intellectual property rights. We may edit, re-categorize, pre-screen, or delete Contributions at any time and for any reason.
              </p>
            </article>
          </section>

          <section id="reviews" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">9. Guidelines for Reviews</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                When posting a review, you must have firsthand experience, avoid offensive or discriminatory language, avoid references to illegal activity, avoid conflicts of interest, avoid conclusions as to legality of conduct, avoid false or misleading statements, and avoid organizing review campaigns.
              </p>
              <p>
                We may accept, reject, or remove reviews at our sole discretion. Reviews do not represent our opinions, and we are not liable for any review.
              </p>
            </article>
          </section>

          <section id="third-party" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">10. Third-Party Websites and Content</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                The Services may contain links to third-party websites and content ("Third-Party Websites" and "Third-Party Content"). We are not responsible for such websites or content and do not endorse them. If you leave the Services to access third-party resources, you do so at your own risk. Review applicable terms and policies of any third-party websites or applications. We do not endorse third-party products or services and are not responsible for purchases made through such websites.
              </p>
            </article>
          </section>

          <section id="services-management" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">11. Services Management</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                We may monitor the Services for violations, take appropriate legal action, restrict access, disable content, remove or disable files and content that are excessive in size or burdensome, and otherwise manage the Services to protect our rights and property and ensure proper functioning.
              </p>
            </article>
          </section>

          <section id="privacy" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">12. Privacy Policy</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                We care about data privacy and security. Please review our Privacy Policy:{" "}
                <a href="https://www.savedbytheplate.com/privacy" className="text-sbtp-green-700 underline" rel="noopener noreferrer">https://www.savedbytheplate.com/privacy</a>. By using the Services, you agree to be bound by our Privacy Policy. The Services are hosted in the United States; by using them from other regions, you consent to transfer and processing in the United States. We do not knowingly collect data from children under 13; if we learn we have, we will delete it promptly.
              </p>
            </article>
          </section>

          <section id="copyright" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">13. Copyright Infringements</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please notify us using the contact information below. A copy of your notification may be sent to the person who posted the material. Misrepresentations in a notification may expose you to liability.
              </p>
            </article>
          </section>

          <section id="term" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">14. Term and Termination</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                These Legal Terms remain in effect while you use the Services. We may, in our sole discretion and without notice or liability, deny access to and use of the Services to any person for any reason, including breach of these Legal Terms or applicable law. We may terminate your use or delete your account and any content you posted at any time. If terminated, you are prohibited from registering a new account under your name or a third party’s name. We may pursue legal action.
              </p>
            </article>
          </section>

          <section id="modifications" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">15. Modifications and Interruptions</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                We may change, modify, or remove contents of the Services at any time without notice and have no obligation to update information. We are not liable for modifications, price changes, suspensions, or discontinuance. We cannot guarantee availability and may need to perform maintenance. You agree we are not liable for downtime or discontinuance.
              </p>
            </article>
          </section>

          <section id="governing-law" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">16. Governing Law</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                These Legal Terms and your use of the Services are governed by the laws of the State of New York, without regard to conflict of law principles.
              </p>
            </article>
          </section>

          <section id="dispute-resolution" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">17. Dispute Resolution</h2>
            <article className="prose prose-neutral max-w-none">
              <h3>Informal Negotiations</h3>
              <p>
                The Parties agree to first attempt to negotiate any dispute informally for at least forty-five (45) days before initiating arbitration. Informal negotiations commence upon written notice from one Party to the other.
              </p>
              <h3>Binding Arbitration</h3>
              <p>
                If unresolved, disputes will be resolved by binding arbitration under the Commercial Arbitration Rules of the AAA and, where appropriate, the AAA Consumer Rules. The arbitration may be conducted in person, by documents, phone, or online. The arbitrator must follow applicable law. Venue: New York, New York, unless otherwise required by AAA rules or law.
              </p>
              <p>
                If a dispute proceeds in court, venue is in the state and federal courts located in New York, New York. In no event shall any dispute be brought more than one (1) year after the cause of action arose. If this provision is found illegal or unenforceable, such dispute shall be decided by a court of competent jurisdiction as stated above.
              </p>
              <h3>Restrictions</h3>
              <p>
                Arbitration shall be limited to the dispute between the Parties individually; no class actions or representative proceedings are permitted.
              </p>
              <h3>Exceptions</h3>
              <p>
                Disputes regarding intellectual property rights, theft, piracy, invasion of privacy, unauthorized use, and claims for injunctive relief are excluded from informal negotiations and arbitration.
              </p>
            </article>
          </section>

          <section id="corrections" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">18. Corrections</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                There may be information on the Services that contains typographical errors, inaccuracies, or omissions. We reserve the right to correct errors and update information at any time without prior notice.
              </p>
            </article>
          </section>

          <section id="disclaimer" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">19. Disclaimer</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOUR USE IS AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THE ACCURACY OR COMPLETENESS OF CONTENT OR THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </article>
          </section>

          <section id="liability" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">20. Limitations of Liability</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES. OUR LIABILITY TO YOU SHALL BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION.
              </p>
            </article>
          </section>

          <section id="indemnification" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">21. Indemnification</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from any claim due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) breach of your representations and warranties; (5) your violation of third-party rights; or (6) any harmful act toward any other user of the Services with whom you connected via the Services.
              </p>
            </article>
          </section>

          <section id="user-data" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">22. User Data</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform routine backups, you are solely responsible for all data that you transmit or that relates to any activity you undertake using the Services.
              </p>
            </article>
          </section>

          <section id="electronic" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">23. Electronic Communications, Transactions, and Signatures</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing. YOU AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS.
              </p>
            </article>
          </section>

          <section id="california" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">24. California Users and Residents</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.
              </p>
            </article>
          </section>

          <section id="misc" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">25. Miscellaneous</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                These Legal Terms and any policies posted by us on the Services constitute the entire agreement between you and us. Our failure to exercise or enforce any right shall not operate as a waiver. These Legal Terms operate to the fullest extent permissible by law. We may assign our rights and obligations to others at any time. If any provision is determined to be unlawful, void, or unenforceable, the remaining provisions remain valid. No joint venture, partnership, employment, or agency relationship exists between you and us. You waive any defenses based on the electronic form of these Legal Terms.
              </p>
            </article>
          </section>

          <section id="contact" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">26. Contact Us</h2>
            <article className="prose prose-neutral max-w-none">
              <p>In order to resolve a complaint or to receive further information regarding use of the Services, please contact us at:</p>
              <p>
                Saved by the Plate Inc.<br />
                556 W 141st Street, Apartment 4E<br />
                New York, NY 10031<br />
                United States
              </p>
              <p>
                Phone: <a href="tel:2072401913" className="text-sbtp-green-700 underline">2072401913</a><br />
                Email: <a href="mailto:info@savedbytheplate.com" className="text-sbtp-green-700 underline">info@savedbytheplate.com</a>
              </p>
            </article>
          </section>
        </main>

        <aside className="mt-12 text-sm text-sbtp-brown-600">
          Note: Links above use in-page anchors and smooth scrolling. If you reached this page via a direct #hash link, we auto-scrolled to the matching section.
        </aside>
      </div>
    </div>
  );
};

export default Terms;
