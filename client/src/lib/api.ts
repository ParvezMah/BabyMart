import { fetchWithConfig } from "../lib/config";

export const fetchData = fetchWithConfig;

// Export the new enhanced function

export {
  fetchWithConfig,
  getApiConfig,
  getAuthHeaders,
  buildQueryString,
  API_ENDPOINTS,
} from "../lib/config";