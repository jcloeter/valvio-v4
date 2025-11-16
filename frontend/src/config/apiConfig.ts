import { Configuration } from '../api/configuration';

/**
 * Creates an API configuration with the Firebase ID token
 * @param idToken - Firebase ID token to be included in Authorization header
 * @returns Configuration object for API calls
 */
export const createApiConfig = (idToken: string | null): Configuration => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  
  return new Configuration({
    basePath: baseURL,
    baseOptions: {
      headers: idToken ? {
        'Authorization': `Bearer ${idToken}`
      } : {}
    }
  });
};

