import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Donately?: {
      show: () => void;
    };
  }
}

const DonationButton = () => {
  const handleDonate = () => {
    if (window.Donately) {
      window.Donately.show();
    }
  };

  return (
    <Button
      onClick={handleDonate}
      className="bg-sbtp-orange-500 hover:bg-sbtp-orange-600 text-white"
    >
      <Heart className="mr-2 h-4 w-4" />
      Donate
    </Button>
  );
};

export default DonationButton;
