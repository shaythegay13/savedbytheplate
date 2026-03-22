
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { GraduationCap, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    role: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // For now, simulate submission. Can be wired to Supabase or email later.
    await new Promise(resolve => setTimeout(resolve, 800));

    setSubmitted(true);
    setLoading(false);
    toast({
      title: "Inquiry sent!",
      description: "We'll get back to you within 3-5 business days.",
    });
  };

  if (submitted) {
    return (
      <div className="w-full">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Thank You!</h1>
          <p className="text-muted-foreground text-lg mb-2">
            We've received your inquiry and will get back to you within 3-5 business days.
          </p>
          <p className="text-muted-foreground">
            In the meantime, feel free to explore our{' '}
            <a href="/education" className="text-primary font-medium hover:underline">education programs</a>{' '}
            or{' '}
            <a href="/local-food/map" className="text-primary font-medium hover:underline">local food map</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <title>Contact Us — Saved by the Plate Inc.</title>
      <meta name="description" content="Get in touch to bring food justice education to your school. Request a program, schedule a tour, or ask us anything." />
      <Navbar />

      <section className="relative bg-green-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-green-200" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Bring Food Justice to Your School
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Tell us about your school and what you're looking for. We'll follow up within 3-5 business days to discuss how we can help.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                name="name"
                required
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                maxLength={255}
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@school.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School or Organization *</Label>
              <Input
                id="school"
                name="school"
                required
                maxLength={200}
                value={formData.school}
                onChange={handleChange}
                placeholder="PS 123, Brooklyn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                name="role"
                maxLength={100}
                value={formData.role}
                onChange={handleChange}
                placeholder="Teacher, Principal, Program Director..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">How can we help? *</Label>
              <Textarea
                id="message"
                name="message"
                required
                maxLength={1000}
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your school, grade levels, and what kind of program you're interested in..."
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full rounded-full text-lg py-6"
            >
              <Send className="w-5 h-5 mr-2" />
              {loading ? 'Sending...' : 'Send Inquiry'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You can also email us directly at{' '}
              <a href="mailto:info@savedbytheplate.org" className="text-primary hover:underline">
                info@savedbytheplate.org
              </a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
