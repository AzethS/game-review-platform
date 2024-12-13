import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@game-platform/shared/api';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((results) => {
        if (results) {
          return {
            results,
            info: {
              version: '1.0',
              type: Array.isArray(results) ? 'list' : 'object',
              count: Array.isArray(results) ? results.length : 1,
            },
          };
        } else {
          return {
            results: null,
            info: {
              version: '1.0',
              type: 'none',
              count: 0,
            },
          };
        }
      })
    );
  }
}
