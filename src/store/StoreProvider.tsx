"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { ApiKeepAlive } from "@/components/layout/ApiKeepAlive";
import { makeStore, setupStoreListeners, type AppStore } from "./store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupStoreListeners(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <ApiKeepAlive />
      {children}
    </Provider>
  );
}
