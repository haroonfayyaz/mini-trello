import "./index.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.REACT_APP_BE_URL + "/graphql",
    credentials: "same-origin"
  }),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
