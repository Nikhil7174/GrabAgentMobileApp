import React, { createContext, useContext, useMemo, useState } from 'react';

export type OrderToast = {
  title?: string;
  restaurant: string;
  etaText: string; // e.g. "By 1:00 pm"
};

type Ctx = {
  toast: OrderToast | null;
  show: (t: OrderToast) => void;
  hide: () => void;
};

const OrderToastContext = createContext<Ctx | undefined>(undefined);

export const OrderToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<OrderToast | null>(null);

  const value = useMemo<Ctx>(
    () => ({
      toast,
      show: (t) => setToast(t),
      hide: () => setToast(null),
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

