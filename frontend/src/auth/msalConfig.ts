import { PublicClientApplication, type Configuration } from "@azure/msal-browser";
import { getRuntimeConfig } from "../lib/runtimeConfig";

const { entraClientId: clientId, entraAuthority: authority } = getRuntimeConfig();

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority,
    redirectUri: `${window.location.origin}/`,
    postLogoutRedirectUri: `${window.location.origin}/`,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
