import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DonationButton = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      const script = document.createElement("script");
      script.src = "https://cdn.donately.com/core/6.0/donately.min.js?v=6.0.67";
      script.setAttribute("data-donately-id", "act_28b81572bc05");
      script.setAttribute("data-stripe-publishable-key", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");
      script.setAttribute("data-donately-form-id", "frm_0a25c5b94edd");
      script.setAttribute("data-donately-fetch-config", "true");
      script.async = true;

      const container = document.getElementById("donately-form-container");
      if (container) {
        container.appendChild(script);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const container = document.getElementById("donately-form-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-sbtp-orange-500 hover:bg-sbtp-orange-600 text-white rounded-full font-semibold shadow-md"
          aria-label="Donate to Saved by the Plate Inc."
        >
          <Heart className="mr-2 h-4 w-4" />
          Donate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Support Saved by the Plate Inc.</DialogTitle>
          <DialogDescription>
            Your donation helps us continue our mission to support food access in our community.
          </DialogDescription>
        </DialogHeader>
        <div 
          id="donately-form-container"
          className="min-h-[400px] w-full"
        />
      </DialogContent>
    </Dialog>
  );
};

export default DonationButton;
