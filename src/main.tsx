import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/apolloClient";
import "./translation/i18n";
import { AssetsProvider } from "./context/AssetsContext.tsx";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Toaster />
      <AssetsProvider>
        <App />
      </AssetsProvider>
    </ApolloProvider>
  </StrictMode>
);
