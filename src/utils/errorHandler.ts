import type { AxiosError } from 'axios';
import axios from 'axios';
import type { ErrorResponse } from '../types/auth';

// Hata tipini genişletiyoruz çünkü API yanıtı 'detail' özelliğini içerebilir.
// Eğer API'nız 422 hataları için 'detail' içinde { msg: string, loc: string[], type: string }
// gibi bir yapı döndürüyorsa, bu tip tanımı ona göre ayarlanmalıdır.
interface ValidationErrorDetail {
  loc: string[];
  msg: string;
  type: string;
}

// ErrorResponse'u güncellemeniz veya ErrorResponse'a ek olarak yeni bir tip oluşturmanız gerekebilir.
// auth.ts dosyanızdaki ErrorResponse interface'ini şu şekilde güncellemeniz tavsiye edilir:
/*
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  detail?: string | ValidationErrorDetail[]; // Bu satırı ekleyin veya güncelleyin
}
*/

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]> // Genel hata mesajları
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    // AxiosError'ın içindeki response.data'nın tipi ErrorResponse olabilir.
    // Ancak 422 hataları için 'detail' alanı farklı bir yapıya sahip olabilir,
    // bu yüzden onu daha spesifik olarak ele almalıyız.
    const axiosError = error as AxiosError<ErrorResponse>;

    // 422 hatalarını özel olarak ele alın
    if (axiosError.response?.status === 422) {
      // API'nızın 422 yanıtında 'detail' alanının tipini daha net belirlemeliyiz.
      // Eğer 'detail' bir dizi (ValidationErrorDetail[]) ise, ona göre davranalım.
      const validationErrors = (axiosError.response.data as any).detail as ValidationErrorDetail[] | undefined;
      let errorMessage = 'Doğrulama hatası: ';

      if (Array.isArray(validationErrors)) {
        // Her bir hatanın 'msg' özelliğine erişiyoruz.
        errorMessage += validationErrors.map(err => err.msg).join(', ');
      } else if (typeof validationErrors === 'string') {
        // Eğer 'detail' doğrudan bir string ise
        errorMessage += validationErrors;
      }
      else {
        // 'detail' tanımsız veya beklenmeyen bir tipteyse
        errorMessage += 'Lütfen girdiğiniz bilgileri kontrol edin.';
      }

      throw new new ApiError(errorMessage, 422);
    }

    // Diğer tüm hataları ele al
    const message = axiosError.response?.data?.message || 'Bir hata oluştu.';
    const statusCode = axiosError.response?.status;
    const errors = axiosError.response?.data?.errors;

    throw new ApiError(message, statusCode, errors);
  }

  // Axios hatası değilse beklenmeyen bir hata fırlat
  throw new ApiError('Beklenmeyen bir hata oluştu.');
}