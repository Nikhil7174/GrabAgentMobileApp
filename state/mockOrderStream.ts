export type OrderUpdate = {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
  bg: string;
};

export const MOCK_UPDATES: OrderUpdate[] = [
  { id: 'u1', title: 'Order Received', subtitle: 'Pizza Palace · 2:15 PM', color: '#22C55E', bg: '#E9F8EF' },
  { id: 'u2', title: 'Preparing Order', subtitle: 'Est. 15–20 minutes', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'u3', title: 'Driver Assigned', subtitle: 'John · Honda Civic · ABC123', color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'u4', title: 'Out for Delivery', subtitle: '5 minutes away', color: '#A855F7', bg: '#F3E8FF' },
  { id: 'u5', title: 'Delivered', subtitle: 'Pending…', color: '#D1D5DB', bg: '#F3F4F6' },
];

// Order Closed update - only added manually when case is resolved
export const ORDER_CLOSED_UPDATE: OrderUpdate = {
  id: 'u6',
  title: 'Order Closed',
  subtitle: 'Case resolved with refund',
  color: '#059669',
  bg: '#D1FAE5'
};

export type Subscription = () => void;

/**
 * Simulates a backend event stream by emitting updates one by one with delays.
 * Returns an unsubscribe function to stop the stream.
 */
export function subscribeToOrderUpdates(
  orderId: string,
  onUpdate: (u: OrderUpdate) => void,
  opts: { initialDelay?: number; stepDelay?: number } = {}
): Subscription {
  const { initialDelay = 500, stepDelay = 1800 } = opts;
  let cancelled = false;
  let timeouts: NodeJS.Timeout[] = [];

  const start = () => {
    let t = initialDelay;
    MOCK_UPDATES.forEach((u) => {
      const handle = setTimeout(() => {
        if (!cancelled) onUpdate(u);
      }, t);
      timeouts.push(handle);
      t += stepDelay;
    });
  };

  start();

  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
    timeouts = [];
  };
}

