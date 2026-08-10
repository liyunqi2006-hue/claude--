"use client";

import { createContext, useContext, useState } from "react";
import type { SubscriptionDuration, SubscriptionPlan } from "@prisma/client";

interface SubscriptionContextValue {
  plan: SubscriptionPlan;
  duration: SubscriptionDuration;
  setPlan: (plan: SubscriptionPlan) => void;
  setDuration: (duration: SubscriptionDuration) => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<SubscriptionPlan>("pro");
  const [duration, setDuration] = useState<SubscriptionDuration>("month");

  return (
    <SubscriptionContext.Provider value={{ plan, duration, setPlan, setDuration }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionSelection() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscriptionSelection must be used within a SubscriptionProvider");
  }
  return ctx;
}
