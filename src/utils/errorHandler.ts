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
    
    // Handle 422 errors specifically
    if (axiosError.response?.status === 422) {
      const validationErrors = axiosError.response.data.detail;
      let errorMessage = 'Validation error: ';
      
      if (Array.isArray(validationErrors)) {
        errorMessage += validationErrors.map(err => err.msg).join(', ');
      } else {
        errorMessage += 'Please check your input';
      }
      
      throw new ApiError(errorMessage, 422);
    }
    
    const message = axiosError.response?.data?.message || 'An error occurred';
    const statusCode = axiosError.response?.status;
    const errors = axiosError.response?.data?.errors;

    throw new ApiError(message, statusCode, errors);
  }

  throw new ApiError('An unexpected error occurred');
}