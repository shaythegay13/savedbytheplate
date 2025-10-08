import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DonationButton = () => {
  const [open, setOpen] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Load Donately script when modal opens
    const script = document.createElement("script");
    script.src = "https://cdn.donately.com/core/6.0/donately.min.js?v=6.0.67";
    script.setAttribute("data-donately-id", "act_28b81572bc05");
    script.setAttribute("data-stripe-publishable-key", "pk_live_51RkxajChJRCHBzGF3llFxNgqCK9wplqjwryV43LyeqIu1HYRxrPEEn8a4twVrNN6dW0Xwen8U5d3xsv95KNgLODz00qVttwG5Q");
    script.setAttribute("data-donately-form-id", "frm_0a25c5b94edd");
    script.setAttribute("data-donately-fetch-config", "true");
    script.async = true;

    if (formContainerRef.current) {
      formContainerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup script when modal closes
      if (formContainerRef.current && formContainerRef.current.contains(script)) {
        formContainerRef.current.removeChild(script);
      }
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-sbtp-orange-500 hover:bg-sbtp-orange-600 text-white"
          aria-label="Donate to Saved by the Plate"
        >
          <Heart className="mr-2 h-4 w-4" />
          Donate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Support Saved by the Plate</DialogTitle>
        </DialogHeader>
        <div 
          ref={formContainerRef} 
          className="min-h-[400px] w-full"
          data-donately-embed="true"
        />
      </DialogContent>
    </Dialog>
  );
};

export default DonationButton;
