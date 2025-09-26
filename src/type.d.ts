export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  data?: T;
  error?: IError;
  meta: IMeta;
  pagination?: IPagination;
}

export interface IError {
  code: string;
  message: string;
  details?: unknown;
}

export interface IMeta {
  timestamp: Date;
  request_id: string;
}

export interface IPagination {
  page: number; // base 1 index
  limit: number;
  total: number;
}
