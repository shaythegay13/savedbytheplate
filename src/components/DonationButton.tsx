import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

declare global {
  interface Window {
    Donately?: Record<string, unknown>;
  }
}

const DONATELY_SRC = "https://cdn.donately.com/core/6.0/donately.min.js?v=6.0.67";
const DONATELY_ATTRS: Record<string, string> = {
  "data-donately-id": "act_28b81572bc05",
  "data-stripe-publishable-key": "pk_live_51RkxajChJRCHBzGF3llFxNgqCK9wplqjwryV43LyeqIu1HYRxrPEEn8a4twVrNN6dW0Xwen8U5d3xsv95KNgLODz00qVttwG5Q",
  "data-donately-form-id": "frm_0a25c5b94edd",
  "data-donately-fetch-config": "true",
};

const DonationButton = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  // Ensure Donately script is present after the button mounts (SPA-safe)
  useEffect(() => {
    const existing = document.getElementById("donately-js") as HTMLScriptElement | null;
    if (existing) return;

    const script = document.createElement("script");
    script.id = "donately-js";
    script.src = DONATELY_SRC;
    script.async = true;
    Object.entries(DONATELY_ATTRS).forEach(([k, v]) => script.setAttribute(k, v));
    document.head.appendChild(script);
  }, []);

  const handleClick = () => {
    // If Donately is not yet loaded, load it and re-trigger the click once ready
    if (!window.Donately) {
      setLoading(true);
      let script = document.getElementById("donately-js") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "donately-js";
        script.src = DONATELY_SRC;
        script.async = true;
        Object.entries(DONATELY_ATTRS).forEach(([k, v]) => script!.setAttribute(k, v));
        document.head.appendChild(script);
      }
      script.addEventListener(
        "load",
        () => {
          setLoading(false);
          // Trigger the Donately handler which listens to the data attribute
          btnRef.current?.click();
        },
        { once: true }
      );
    }
    // If already loaded, Donately's own click handler (bound to data attribute) will run
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className="donately-button inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-sbtp-orange-500 hover:bg-sbtp-orange-600 text-white disabled:opacity-60"
      data-donately-trigger="true"
      disabled={loading}
      aria-busy={loading}
      aria-label="Donate to Saved by the Plate"
    >
      <Heart className="mr-2 h-4 w-4" />
      {loading ? "Loading…" : "Donate"}
    </button>
  );
};

export default DonationButton;
