import type { AxiosError } from 'axios';
import axios from 'axios';
import type { ErrorResponse } from '../types/auth';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    
    // Handle 400 Bad Request errors
    if (axiosError.response?.status === 400) {
      const message = axiosError.response.data?.message || 'Invalid request data';
      throw new ApiError(message, 400);
    }

    // Handle 422 Validation errors
    if (axiosError.response?.status === 422) {
      const validationErrors = axiosError.response.data?.errors;
      let errorMessage = 'Validation error: ';
      
      if (validationErrors) {
        errorMessage += Object.entries(validationErrors)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('; ');
      } else {
        errorMessage += 'Please check your input';
      }
      
      throw new ApiError(errorMessage, 422, validationErrors);
    }
    
    // Handle other errors
    const message = axiosError.response?.data?.message || 'An error occurred';
    const statusCode = axiosError.response?.status;
    throw new ApiError(message, statusCode);
  }

  throw new ApiError('An unexpected error occurred');
}