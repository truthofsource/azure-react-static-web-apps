export type RuntimeConfig = {
  employeeBadgesEnabled?: boolean;
  employeeProfilePhotosEnabled?: boolean;
  apiBaseUrl: string;
  apiScope: string;
  entraTenantId: string;
  entraClientId: string;
  entraAuthority: string;
};

let activeConfig: RuntimeConfig | null = null;
let payrollAccessToken = "";

export function capturePayrollAccessToken(): void {
  payrollAccessToken = new URLSearchParams(window.location.hash.slice(1)).get("access") ?? "";
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#private-link`);
}

export function getPayrollAccessToken(): string {
  return payrollAccessToken;
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateRuntimeConfig(value: unknown, origin: string): RuntimeConfig {
  const required=["apiBaseUrl","apiScope","entraAuthority","entraClientId","entraTenantId"];
  if (!record(value) || required.some(key=>!(key in value)) || Object.keys(value).some(key=>!required.includes(key)&&!["employeeBadgesEnabled","employeeProfilePhotosEnabled"].includes(key))
      || ["employeeBadgesEnabled","employeeProfilePhotosEnabled"].some(key => key in value && typeof value[key]!=="boolean")) {
    throw new Error("Invalid Workforce runtime configuration fields");
  }
  for (const [key, item] of Object.entries(value)) {
    if(["employeeBadgesEnabled","employeeProfilePhotosEnabled"].includes(key))continue;
    if (typeof item !== "string" || !item.trim() || item !== item.trim()) {
      throw new Error(`Invalid Workforce runtime configuration: ${key}`);
    }
  }
  const config = value as RuntimeConfig;
  const tenant = config.entraTenantId.toLowerCase();
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(tenant) ||
      !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(config.entraClientId)) {
    throw new Error("Invalid Workforce Entra identity configuration");
  }
  const authority = new URL(config.entraAuthority);
  if (authority.username || authority.password || authority.protocol !== "https:" || authority.origin !== "https://login.microsoftonline.com" ||
      authority.pathname !== `/${tenant}` || authority.search || authority.hash) {
    throw new Error("Invalid Workforce Entra authority");
  }
  const api = new URL(config.apiBaseUrl);
  if (api.port || api.protocol !== "https:" || api.username || api.password || api.search || api.hash ||
      api.pathname !== "/" || !api.hostname.endsWith(".azurewebsites.net")) {
    throw new Error("Invalid Workforce API base URL");
  }
  const scope = `api://${tenant}/`;
  if (!config.apiScope.toLowerCase().startsWith(scope) || !config.apiScope.endsWith("/access_as_user")) {
    throw new Error("Invalid Workforce API scope");
  }
  if (new URL(origin).protocol !== "https:" && !origin.startsWith("http://localhost:")) {
    throw new Error("Workforce requires a secure origin");
  }
  return config;
}

export async function loadRuntimeConfig(): Promise<void> {
  // Development stays local; production always reads destination-owned public config.
  const value = import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL ? {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    apiScope: import.meta.env.VITE_WORKFORCE_API_SCOPE,
    entraTenantId: import.meta.env.VITE_ENTRA_TENANT_ID,
    entraClientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    entraAuthority: import.meta.env.VITE_ENTRA_AUTHORITY,
  } : await (async () => {
    const response = await fetch("/workforce-runtime-config.json", { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) throw new Error("Workforce runtime configuration unavailable");
    return response.json() as Promise<unknown>;
  })();
  activeConfig = validateRuntimeConfig(value, window.location.origin);
}

export function getRuntimeConfig(): RuntimeConfig {
  if (!activeConfig) throw new Error("Workforce runtime configuration has not loaded");
  return activeConfig;
}
