import { HttpInterceptorFn } from '@angular/common/http';

export const sharedInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
