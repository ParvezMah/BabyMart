interface ApiConfig {
  baseUrl: string;
  isProduction: boolean;
}

/**
 * Get API configuration based on environment
 */
const normalizeBaseUrl = (baseUrl: string): string => {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/api")) {
    return trimmed;
  }
  return `${trimmed}/api`;
};

export const getApiConfig = (): ApiConfig => {
  // Check if we're in browser or server environment
  const isClient = typeof window !== "undefined";

  let baseUrl: string;

  if (isClient) {
    // Client-side: use NEXT_PUBLIC_API_URL
    baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  } else {
    // Server-side: use API_ENDPOINT
    baseUrl = process.env.API_ENDPOINT || "http://localhost:8000/api";
  }

  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_APP_ENV === "production";

  return {
    baseUrl: normalizeBaseUrl(baseUrl),
    isProduction,
  };
};




/**
 * Enhanced fetch function with better error handling
 */
export async function fetchWithConfig<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const { baseUrl } = getApiConfig();

  const url = `${baseUrl}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 100 },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${endpoint}`
      );
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}