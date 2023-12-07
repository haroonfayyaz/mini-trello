import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

const client = new ApolloClient({
  uri: "https://5042-39-63-26-37.ngrok-free.app/graphql",
  cache: new InMemoryCache(),
  fetchOptions: {
    mode: "no-cors",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
