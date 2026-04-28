import { jsx as _jsx } from "react/jsx-runtime";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";
window.Telegram?.WebApp.ready();
window.Telegram?.WebApp.expand();
createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(TonConnectUIProvider, { manifestUrl: `${window.location.origin}/tonconnect-manifest.json`, children: _jsx(App, {}) }) }));
