import React, { createContext, useContext, useMemo, useState } from 'react';

export type OrderToast = {
  title?: string;
  restaurant: string;
  etaText: string; // e.g. "By 1:00 pm"
  // Optional call-to-action (e.g., when restaurant is overloaded)
  ctaText?: string;
  ctaRoute?: string; // route to navigate to when CTA is pressed
  pulse?: boolean; // whether to animate CTA
};

type Ctx = {
  toast: OrderToast | null;
  show: (t: OrderToast) => void;
  hide: () => void;
  // Starts a timed flow that, after ~15s, shows delivery updates and an overload alert with CTA
  startOverloadFlow: (params: { restaurant: string; etaText: string; ctaRoute?: string }) => void;
};

const OrderToastContext = createContext<Ctx | undefined>(undefined);

export const OrderToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<OrderToast | null>(null);
  const timersRef = React.useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Public API to start the hardcoded overload flow
  const startOverloadFlow = (params: { restaurant: string; etaText: string; ctaRoute?: string }) => {
    clearTimers();
    // Wait 15s before starting updates
    const t0 = setTimeout(() => {
      setToast({ restaurant: params.restaurant, etaText: params.etaText, title: 'Preparing order' });

      // After 4s: Out for delivery
      const t1 = setTimeout(() => {
        setToast({ restaurant: params.restaurant, etaText: 'About 10 min', title: 'Out for delivery' });
      }, 4000);
      timersRef.current.push(t1);

      // After 8s: Restaurant overloaded alert with CTA
      const t2 = setTimeout(() => {
        setToast({
          restaurant: params.restaurant,
          etaText: 'Delays expected',
          title: 'Restaurant overloaded',
          ctaText: 'Get help',
          ctaRoute: params.ctaRoute ?? '/assistant',
          pulse: true,
        });
      }, 8000);
      timersRef.current.push(t2);

      // After 12s: Keep CTA visible, update copy subtly
      const t3 = setTimeout(() => {
        setToast({
          restaurant: params.restaurant,
          etaText: 'ETA updating…',
          title: 'Restaurant overloaded',
          ctaText: 'Get help',
          ctaRoute: params.ctaRoute ?? '/assistant',
          pulse: true,
        });
      }, 12000);
      timersRef.current.push(t3);
    }, 15000);

    timersRef.current.push(t0);
  };

  const value = useMemo<Ctx>(
    () => ({
      toast,
      show: (t) => setToast(t),
      hide: () => {
        clearTimers();
        setToast(null);
      },
      startOverloadFlow,
    }),
    [toast]
  );

  return <OrderToastContext.Provider value={value}>{children}</OrderToastContext.Provider>;
};

export function useOrderToast() {
  const ctx = useContext(OrderToastContext);
  if (!ctx) throw new Error('useOrderToast must be used within OrderToastProvider');
  return ctx;
}

