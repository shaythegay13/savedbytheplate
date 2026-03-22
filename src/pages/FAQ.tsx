import { ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqData = {
    programs: [
      {
        question: "How do I schedule an education program for my school or organization?",
        answer: "To schedule an education program, please contact us directly at info@savedbytheplate.org. We'll work with you to understand your needs, student population, and scheduling preferences to create a customized program that fits your requirements."
      },
      {
        question: "What age groups do you work with?",
        answer: "We work with students of all ages! Our programs are fully customizable to meet the developmental needs and learning objectives of any age group, from elementary school through high school and beyond. Whether you're working with young children or older teens, we'll tailor the curriculum to be age-appropriate and engaging."
      },
      {
        question: "How much do your education programs cost?",
        answer: "Program costs depend on the length and scope of the program you choose. We work with each school or organization individually to design a program that fits your budget and educational goals. Once we secure long-term funding, we'll be able to offer these programs at lower prices to make food justice education even more accessible. Contact us at info@savedbytheplate.org to discuss pricing for your specific needs."
      },
      {
        question: "Can programs be customized for our specific curriculum needs?",
        answer: "Absolutely! All of our programs are designed to be flexible and customizable. Whether you want to focus more on food justice, composting, community gardens, or urban agriculture, we'll work with you to create a program that aligns with your educational objectives and student interests."
      },
      {
        question: "Where do programs take place?",
        answer: "Our programs can take place at your school, at a local community garden, or at another location that works for your group. We serve all five boroughs of New York City and can bring our education programs directly to your students."
      }
    ],
    tools: [
      {
        question: "What is Ask Jane?",
        answer: "Ask Jane is an AI-powered voice agent garden assistant. You can ask Jane any questions about growing food, gardening techniques, plant care, composting, and urban agriculture. Jane responds both in voice and in text, making it easy to get personalized gardening advice tailored to your space and needs. Try Jane for free with a 2-day trial!"
      },
      {
        question: "How does the Local Food Map work?",
        answer: "Our interactive Local Food Map helps you discover community gardens, farmers markets, food banks, community fridges, and urban farms across all five boroughs of New York City. Simply explore the map to find resources near you, filter by resource type, and get directions to locations that support local food access."
      },
      {
        question: "Is Ask Jane free to use?",
        answer: "Ask Jane offers a free 2-day trial so you can experience the full capabilities of your AI garden assistant. After the trial, subscription plans start at $8/month for educators and $10/month for individuals. We also offer an annual plan for $100/year."
      }
    ],
    organization: [
      {
        question: "Are you a 501(c)(3) nonprofit organization?",
        answer: "We are currently in the application process for our 501(c)(3) nonprofit status. Our mission has always been rooted in nonprofit values: making food justice education accessible to all communities, regardless of their ability to pay. We're working diligently to complete the application process and will update our community as soon as our status is approved."
      },
      {
        question: "What areas of New York City do you serve?",
        answer: "We serve all five boroughs of New York City: Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Our programs can be brought to schools, community centers, and gardens throughout NYC."
      },
      {
        question: "What is your mission?",
        answer: "Our mission is to empower the next generation to build a resilient food future by connecting children and families to community gardens, sustainable eating education, and food justice initiatives across New York City and beyond. We provide experiential programs and resources that make urban gardening accessible, foster curiosity, and strengthen local communities."
      },
      {
        question: "Who founded Saved by the Plate Inc.?",
        answer: "Saved by the Plate Inc. was founded by Shay Bouchles, who recognized a critical disconnect in urban environments between education, food spaces, and youth. Shay created this organization to bridge that gap and ensure that young people in New York City have access to hands-on food justice education and the knowledge to become advocates for equitable, sustainable food systems."
      },
      {
        question: "How can I support your work?",
        answer: "There are several ways to support Saved by the Plate Inc.: hire us to run an education program at your school or organization, share our resources with your community, contribute to our food map by reporting local food spaces, or reach out to info@savedbytheplate.org to discuss partnership opportunities. As we grow, we'll be adding more ways to get involved and support our mission."
      }
    ]
  };

  // Generate FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ...faqData.programs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      })),
      ...faqData.tools.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      })),
      ...faqData.organization.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <title>Frequently Asked Questions — Saved by the Plate Inc.</title>
      <meta name="description" content="Get answers to common questions about Saved by the Plate Inc.'s education programs, Ask Jane AI garden assistant, nonprofit status, and food justice mission in NYC." />
      <link rel="canonical" href="https://www.savedbytheplate.org/faq" />
      <meta property="og:title" content="FAQ | Saved by the Plate Inc." />
      <meta property="og:url" content="https://www.savedbytheplate.org/faq" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />

      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our programs, tools, and mission
            </p>
          </div>

          {/* Education Programs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Education Programs</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.programs.map((faq, index) => (
                <AccordionItem
                  key={`program-${index}`}
                  value={`program-${index}`}
                  className="bg-white rounded-lg border border-border px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Tools & Resources */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Tools & Resources</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.tools.map((faq, index) => (
                <AccordionItem
                  key={`tool-${index}`}
                  value={`tool-${index}`}
                  className="bg-white rounded-lg border border-border px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* About Our Organization */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-green-800 mb-6">About Our Organization</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.organization.map((faq, index) => (
                <AccordionItem
                  key={`org-${index}`}
                  value={`org-${index}`}
                  className="bg-white rounded-lg border border-border px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact CTA */}
          <div className="bg-green-800 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
            <p className="text-green-100 mb-6">
              We're here to help! Reach out to us and we'll get back to you as soon as possible.
            </p>
            <a
              href="mailto:info@savedbytheplate.org"
              className="inline-block bg-white text-green-800 font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
