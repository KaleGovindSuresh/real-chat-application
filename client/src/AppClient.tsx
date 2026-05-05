"use client";

import App from "./App";
import Providers from "./app/Providers";

export default function AppClient() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}
