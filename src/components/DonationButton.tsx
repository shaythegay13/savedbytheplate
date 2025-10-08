import { Heart } from "lucide-react";

const DonationButton = () => {
  return (
    <button
      className="donately-button inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-sbtp-orange-500 hover:bg-sbtp-orange-600 text-white"
      data-donately-trigger="true"
    >
      <Heart className="mr-2 h-4 w-4" />
      Donate
    </button>
  );
};

export default DonationButton;
