import React from "react";
import ReactDOM from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { App } from "./App.js";
import { ErrorBoundary } from "./components/ErrorBoundary.js";
import "./styles.css";

// TON manifest for TonConnect. Hosted in /public/tonconnect-manifest.json.
const manifestUrl = new URL("/tonconnect-manifest.json", window.location.origin).href;

// Telegram WebApp init
interface TgWebApp {
  ready?: () => void;
  expand?: () => void;
  version?: string;
  setHeaderColor?: (c: string) => void;
  setBackgroundColor?: (c: string) => void;
  HapticFeedback?: {
    impactOccurred?: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred?: (t: "error" | "success" | "warning") => void;
    selectionChanged?: () => void;
  };
  BackButton?: { show?: () => void; hide?: () => void; onClick?: (cb: () => void) => void; offClick?: (cb: () => void) => void };
  MainButton?: { setText?: (t: string) => void; show?: () => void; hide?: () => void; onClick?: (cb: () => void) => void };
  disableVerticalSwipes?: () => void;
}
const tg = ((window as unknown) as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp;
if (tg) {
  try {
    tg.ready?.();
    tg.expand?.();
    tg.disableVerticalSwipes?.();
    // setHeaderColor / setBackgroundColor supported from Bot API 6.1+
    const ver = parseFloat(String(tg.version ?? "6.0"));
    if (ver >= 6.1) {
      tg.setHeaderColor?.("#03060f");
      tg.setBackgroundColor?.("#03060f");
    }
  } catch {}
}
// Expose haptic globally for game events
(window as unknown as { __haptic?: (k: "light" | "medium" | "heavy" | "success" | "error") => void }).__haptic = (k) => {
  try {
    const h = tg?.HapticFeedback;
    if (!h) return;
    if (k === "light" || k === "medium" || k === "heavy") h.impactOccurred?.(k);
    else h.notificationOccurred?.(k === "success" ? "success" : "error");
  } catch {}
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </TonConnectUIProvider>
  </React.StrictMode>,
);
