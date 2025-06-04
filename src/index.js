import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import AppContext from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppContext>
    <Auth0Provider
      domain="dev-q3edy5ubyld6vj1l.us.auth0.com"
      clientId="lwPeRfVzu8N7pkZnAIXm4IOIQ7iuwWWc"
      redirectUri={window.location.origin}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </AppContext>
);
serviceWorker.unregister();
