"use client";

import { useEffect, useMemo, useState } from "react";
import type { ServiceType } from "@/types";

export function useCart() {
  const [items, setItems] = useState<ServiceType[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("kmdev-cart");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("kmdev-cart", JSON.stringify(items));
  }, [items]);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.priceFrom, 0), [items]);

  function addItem(service: ServiceType) {
    setItems((current) => {
      if (current.some((item) => item.name === service.name)) return current;
      return [...current, service];
    });
  }

  function removeItem(name: string) {
    setItems((current) => current.filter((item) => item.name !== name));
  }

  return { items, total, addItem, removeItem };
}
