import React, { useEffect } from "react";

// Terms of Service page with working in-page anchor links
// NOTE: This replaces previously pasted raw HTML that broke JSX parsing

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
    // Keep hash in URL without jumping
    history.replaceState(null, "", `#${id}`);
  }
};

const Terms: React.FC = () => {
  useEffect(() => {
    // Basic SEO
    document.title = "Terms of Service | Saved by the Plate"; // <60 chars

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

    // If the page loads with a hash, scroll to it
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => scrollToId(id), 50);
    }
  }, []);

  return (
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
        {sections.map((s) => (
          <section id={s.id} key={s.id} className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-sbtp-green-800 mb-3">{s.title}</h2>
            <article className="prose prose-neutral max-w-none">
              <p>
                This section outlines {s.title.replace(/^[0-9]+\.\s*/, "").toLowerCase()}. For full legal details, please consult the official policy as provided by Saved by the Plate. If you have questions, contact us at
                {" "}
                <a href="mailto:info@savedbytheplate.com" className="text-sbtp-green-700 underline">info@savedbytheplate.com</a>.
              </p>
            </article>
          </section>
        ))}
      </main>

      <aside className="mt-12 text-sm text-sbtp-brown-600">
        Note: Links above use in-page anchors and smooth scrolling. If you reached this page via a direct #hash link, we auto-scrolled to the matching section.
      </aside>
    </div>
  );
};

export default Terms;
