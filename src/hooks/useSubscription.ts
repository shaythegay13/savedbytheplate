import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface SubscriptionStatus {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
  price: string | null;
  currency: string | null;
  loading: boolean;
  error: string | null;
}

export const useSubscription = (user: User | null) => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    product_id: null,
    subscription_end: null,
    price: null,
    currency: null,
    loading: true,
    error: null,
  });

  const checkSubscription = async () => {
    if (!user) {
      setStatus({
        subscribed: false,
        product_id: null,
        subscription_end: null,
        price: null,
        currency: null,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setStatus({
        subscribed: data.subscribed || false,
        product_id: data.product_id || null,
        subscription_end: data.subscription_end || null,
        price: data.price || null,
        currency: data.currency || null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to check subscription",
      }));
    }
  };

  useEffect(() => {
    checkSubscription();

    // Check subscription status every 5 minutes
    const interval = setInterval(checkSubscription, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return { ...status, refresh: checkSubscription };
};
