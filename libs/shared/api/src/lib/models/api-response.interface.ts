export interface ApiMetaInfo{
    version: string
    type: 'object' | 'list' | 'none'
    count: number
}

export interface ApiResponse<T> {
    results: T;
    info?: {
      version?: string;
      count?: number;
      [key: string]: any;
    };
  }