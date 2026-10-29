const configuredHost = process.env.NEXT_PUBLIC_API_HOST?.trim() ?? "";

export function getApiBaseUrl(): string {
  return configuredHost.replace(/\/$/, "");
}

export function isApiHostConfigured(): boolean {
  return configuredHost.length > 0;
}
