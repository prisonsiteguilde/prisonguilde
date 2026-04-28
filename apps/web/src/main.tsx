import { TonConnectUIProvider } from "@tonconnect/ui-react";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

window.Telegram?.WebApp.ready();
window.Telegram?.WebApp.expand();

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={`${window.location.origin}/tonconnect-manifest.json`}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);
