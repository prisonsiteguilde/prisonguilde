import React from "react";
import ReactDOM from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { App } from "./App.js";
import "./styles.css";

// TON manifest for TonConnect. Hosted in /public/tonconnect-manifest.json.
const manifestUrl = new URL("/tonconnect-manifest.json", window.location.origin).href;

// Telegram WebApp init
const tg = (window as any).Telegram?.WebApp;
if (tg) {
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.("#03060f");
    tg.setBackgroundColor?.("#03060f");
  } catch {}
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
);
