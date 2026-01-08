import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { router } from "./router/Routes";

import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <ErrorBoundary>
           <RouterProvider router={router} />
        </ErrorBoundary>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
