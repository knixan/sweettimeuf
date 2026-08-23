"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { BuyerType } from "@/lib/pricing";

type BuyerTypeContextType = {
  buyerType: BuyerType;
  setBuyerType: (type: BuyerType) => void;
};

const BuyerTypeContext = createContext<BuyerTypeContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "buyerType";

export function BuyerTypeProvider({ children }: { children: ReactNode }) {
  const [buyerType, setBuyerTypeState] = useState<BuyerType>("private");

  // Läs sparat val efter mount, för att undvika hydration-mismatch mot
  // server-renderingen (som alltid utgår från "private").
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "company" || saved === "private") {
      setBuyerTypeState(saved);
    }
  }, []);

  const setBuyerType = (type: BuyerType) => {
    setBuyerTypeState(type);
    localStorage.setItem(STORAGE_KEY, type);
  };

  return (
    <BuyerTypeContext.Provider value={{ buyerType, setBuyerType }}>
      {children}
    </BuyerTypeContext.Provider>
  );
}

export function useBuyerType() {
  const context = useContext(BuyerTypeContext);
  if (!context) {
    throw new Error("useBuyerType must be used within BuyerTypeProvider");
  }
  return context;
}
